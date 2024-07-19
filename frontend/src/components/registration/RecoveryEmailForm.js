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
import { useState } from "react";
import validator from "validator";

const defaultTheme = createTheme();

export default function RecoveryEmailForm() {

  const [feedbackMessage, setFeedbackMessage] = useState("");

  async function verifyEmail(email) {

    try {
      const response = await fetch("/verify_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log(data.message);

        if (data.message === "Email Verified") {
          return true;
        } else {
          return false;
        }
      }

    } catch (error) {
      console.log("Error" + error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    

    if (validator.isEmail(email)) {
      // email is valid
    } else {
      // email is not valid
      alert(
        "Email validation failed: Please ensure email is in a valid format"
      );
      return;
    }

    const isVerified = await verifyEmail(email);

    if (isVerified) {
      //Email exists in database
    } else {
      console.log("Email verification failed")
    }

    try {
      const response = await fetch("/generate_recovery_url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setFeedbackMessage("Recovery email SENT.");

        const data = await response.json();

        console.log(data.message);

        if (data.message === "URL_generated"){
          
          

        }


      }

    } catch (error) {
      console.log("Error" + error)
      setFeedbackMessage("Failed to send recovery email.");
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
            Enter Recovery Email
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
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Recovery Email
            </Button>
          </Box>
          {feedbackMessage && (
            <Typography component="p" variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              {feedbackMessage}
            </Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
