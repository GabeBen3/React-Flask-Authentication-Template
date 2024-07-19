import React, { useEffect, useState } from 'react';
import LogoutButton from '../registration/LogoutButton';
import useToken from '../registration/UseToken';

export default function MainView() {
    const { token, setToken} = useToken();
    const [credentialData, setCredentialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCredentials = async () => {

            if (!token) return;

            try {
                const response = await fetch("/fetch_credentials", { 
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.access_token) {
                        setToken(data.access_token);
                    }

                    setCredentialData({
                        email: data.email,
                        password: data.password
                    });

                    setLoading(false);
                } else {
                    setError("Error: No response from server");
                    setLoading(false);
                }
            } catch (error) {
                setError("Error: " + error.message);
                setLoading(false);
            }
        };

        fetchCredentials();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Main View</h1>
            
                {credentialData ? (
                    <div>
                        <h2> Welcome to the main view. You are current logged in as: {credentialData.email}</h2>
                        <LogoutButton />

                    </div>
                ) : (
                    <h2>No credential data</h2>
                )}
            
        </div>
    );
};


