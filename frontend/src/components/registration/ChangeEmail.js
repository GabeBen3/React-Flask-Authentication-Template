import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
// import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import validator from "validator";
import useToken from "./UseToken";

export default function ChangeEmail() {
  const defaultTheme = createTheme();

  const { state } = useLocation();

  const { token, setToken } = useToken();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const newemail = formData.get("newemail");

    if (!newemail) {
      alert("No email entered");
      return;
    }

    if (validator.isEmail(newemail)) {
        // email is valid
      } else {
        // email is not valid
        alert(
          "Email validation failed: Please ensure email is in a valid format"
        );
        return;
    }

    if (newemail === state.email) {
      alert("New email cannot be the same as the old one.");
      return;
    }

    try {
      const response = await fetch("/change_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ newemail }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log(data);

        if (data.message === "email updated") {
          setToken(data.access_token);
          navigate("/");
        } else {
          alert(data.message);
          return;
        }
      }
    } catch (error) {
      console.error("Error: " + error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            Change email:
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="newemail"
              label="New email"
              name="newemail"
              autoComplete="email"
              defaultValue={state.email}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
