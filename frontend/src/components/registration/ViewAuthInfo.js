import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmPassword from './ConfirmPassword';
import LogoutButton from './LogoutButton';

const defaultTheme = createTheme();

export default function ViewAuthInfo() {

        const [credentialData, setCredentialData] = useState(null)

        const [confirmPassword, setConfirmPassword] = useState(false)

        const navigate = useNavigate();

        const changeEmailRedirect  = async () => {
          navigate('changeEmail', {state:{email: credentialData.email}});
        }

        const changePasswordRedirect  = async () => {
          navigate('changePassword');
        }

        
    
    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 4,
                    marginLeft: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                }}
            >
                {confirmPassword ? (
                    <>
                        <Typography component="h1" variant="h5">
                            Credential Info:
                        </Typography>
                        {credentialData ? (
                            <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              marginTop: 2,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body1"><strong>email:</strong> {credentialData.email}</Typography>
                              <Button variant="contained" color="primary" sx={{ marginLeft: 2 }} onClick={changeEmailRedirect}> 
                                Change email 
                              </Button>
                            </Box>
                            <br></br>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Button variant="contained" color="primary" sx={{ marginLeft: 2 }} onClick={changePasswordRedirect}> 
                                Change Password 
                              </Button>
                            </Box>
                            <br></br>
                            
                            
                            <LogoutButton />
                            
                          </Box>
                        ) : (
                        <Typography variant="body1">Loading Credentials...</Typography>
                        )}
                    </>
                ) : (
                    <div>
                        <ConfirmPassword credentialData = {credentialData} setCredentialData={setCredentialData} setConfirmPassword = {setConfirmPassword}/>
                    </div>
                )}


                
            </Box>
        </ThemeProvider>
    )
        
}