import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
// import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link } from "react-router-dom";
import validator from "validator";
import { validateCharacters } from "./PasswordValidator";
import useToken from "./UseToken";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function LoginForm() {
  const { setToken } = useToken();

  // const validate = (value) => {

  //   if (validator.isStrongPassword(value, {
  //       minLength: 8, minLowercase: 1,
  //       minUppercase: 1, minNumbers: 1, minSymbols: 1
  //   })) {
  //       console.log("VALIDATOR: Password validated")
  //       return true;
  //   } else {
  //       console.log("VALIDATOR: Password validation failed")
  //       return false;
  //   }
  // }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");

    const password = formData.get("password");

    if (validator.isEmail(email)) {
      // email is valid
    } else {
      // email is not valid
      alert(
        "Email validation failed: Please ensure email is in a valid format"
      );
      return;
    }

    // Password validation check
    if (!validateCharacters(password)) {
      alert(
        "Not a valid password: Please ensure password contains: 1 lowercase character, 1 uppercase character, 1 symbol, 1 number"
      );
      return;
    }

    if (!email) {
      alert("No email entered");
      return;
    }

    if (!password) {
      alert("No password entered");
      return;
    }

    try {
      const response = await fetch("/login_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.message === "Login Successful") {
          console.log(data);
          setToken(data.access_token);
          window.location.reload();
        } else {
          alert(data.message);
          console.error("Error: " + data.message);
        }
      } else {
        const data = await response.json();
        alert(data.message);
        console.error("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
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
            Log in
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
              label="email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/recoveryEmailForm" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/signUpForm">Don't have an account? Sign Up</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
