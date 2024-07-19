import Button from '@mui/material/Button';
import React from "react";
import { useNavigate } from 'react-router-dom';
import useToken from './UseToken';

export default function LogoutButton () {

    const{token, removeToken} = useToken();


    const navigate = useNavigate();

    const logout_user = async () => {
        try {
            const response = await fetch("/logout_user", { 
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(data.message)
                removeToken();
                navigate("/")
                window.location.reload();
            } else {
                console.log("ERROR: No message received from server" )
            }  
        } catch (error) {
            console.log("ERROR: " + error)
        }
        
    };

    return (
        <Button onClick={logout_user} variant="contained">Logout</Button>
    )


}