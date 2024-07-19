import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
// import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useToken from './UseToken';

export default function ChangeUsername () {

    const defaultTheme = createTheme();

    const {state} = useLocation();

    const {token, setToken} = useToken();

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const newUsername = formData.get('newUsername');

        if (!newUsername) {
            alert("No username entered")
            return;
        }

        if (newUsername === state.username) {
            alert("New username cannot be the same as the old one.")
            return;
        }

        try {
            const response = await fetch("/change_username", { 
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({newUsername}),
            });

            if (response.ok) {

                const data = await response.json();

                console.log(data);

                if (data.message === "Username updated"){
                    setToken(data.access_token);
                    navigate("/");
                } else {
                    alert(data.message)
                    return;
                }

                
            }

              

        } catch (error) {
            console.error("Error: " + error)
        }
    }


    return (
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              </Avatar>
              <Typography component="h1" variant="h5">
                Change Username: 
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="newUsername"
                  label="New Username"
                  name="newUsername"
                  autoComplete="email"
                  defaultValue={state.username}
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