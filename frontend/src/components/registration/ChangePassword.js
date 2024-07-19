import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
import { useNavigate } from "react-router-dom";
import { validateCharacters } from "./PasswordValidator";
import useToken from "./UseToken";

const defaultTheme = createTheme();

export default function ChangePassword() {

    const navigate = useNavigate();

    const { token, removeToken } = useToken();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const old_pswd = formData.get("old_pswd");
    const new_pswd = formData.get("new_pswd");
    const confirm_new_pswd = formData.get("confirm_new_pswd");

    if (!old_pswd) {
        alert("Old Password: No password entered");
        return;
      }
      if (!new_pswd) {
        alert("New Password: No password entered");
        return;
      }
      if (!confirm_new_pswd) {
        alert("Confirm New Password: No password entered");
        return;
      }

    if (!validateCharacters(old_pswd)) {
        alert(
            "Old Password: Not a valid password: Please ensure password contains: 1 lowercase character, 1 uppercase character, 1 symbol, 1 number"
        );
        return;
    }
    if (!validateCharacters(new_pswd)) {
        alert(
            "New Password: Not a valid password: Please ensure password contains: 1 lowercase character, 1 uppercase character, 1 symbol, 1 number"
        );
        return;
    }
    if (!validateCharacters(confirm_new_pswd)) {
        alert(
            "Confirm New Password: Not a valid password: Please ensure password contains: 1 lowercase character, 1 uppercase character, 1 symbol, 1 number"
        );
        return;
    }

    if (confirm_new_pswd !== new_pswd) {
        alert(
            "Passwords do not match"
        );
        return;
    }

 

    try {
      const response = await fetch("/change_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({old_pswd, new_pswd}),
      });

      if (response.ok) {
        const data = await response.json();

        console.log(data.message);

        if (data.message === "Password has been changed") {
            removeToken();
            navigate("/");
            window.location.reload();
        }
      }

    } catch (error) {
      console.log("Error" + error)
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
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
              name="old_pswd"
              label="Old Password"
              type="password"
              id="old_pswd"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="new_pswd"
              label="New Password"
              type="password"
              id="new_pswd"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm_new_pswd"
              label="Confirm New Password"
              type="password"
              id="confirm_new_pswd"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
