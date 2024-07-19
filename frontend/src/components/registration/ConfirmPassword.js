import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Button, Container } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { validateCharacters } from './PasswordValidator';
import useToken from './UseToken';


const defaultTheme = createTheme();

export default function ConfirmPassword(props) {

        const {token} = useToken();

        const handleSubmit = async (event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);
            const formPassword = formData.get('password');

            if (!validateCharacters(formPassword)){
              alert("Not a valid password: Please ensure password contains: 1 lowercase character, 1 uppercase character, 1 symbol, 1 number")
              return;
            }

            try {
                
                const response = await fetch("/confirm_password", { 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({formPassword}),
                });

                if (response.ok) {
                    const data = await response.json();

                    console.log(data)

                    if (data.message === "Password incorrect") {
                      console.error("Error: Password incorrect");
                      alert("Password incorrect")

                    } 
                    
                    if (data.message === "Confirm Password Successful") {

                        console.log("Password Confirmed")
                        
                        props.setCredentialData({
                            email: data.email,
                            password: data.password
                        });

                        props.setConfirmPassword(true);
            
                    } else {

                      console.error("Error: No response from server");

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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Confirm Password: 
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              Confirm
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    )
        
}