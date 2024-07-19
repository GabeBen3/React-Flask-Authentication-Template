import { useState } from 'react';

function useToken() {

    const [token, setToken] = useState(getToken());

    function getToken() {
        const userToken = localStorage.getItem('token');

        // Only return token if it exists
        return userToken ? userToken : null
    }

    function saveToken(userToken) {
        localStorage.setItem('token', userToken);
        setToken(userToken);
    };

    function removeToken() {
        localStorage.removeItem("token");
        setToken(null);
    };

    return {
        // Set exported hook as Reference to saveToken function 
        setToken: saveToken,
        token,
        removeToken,
        getToken
    };

}

export default useToken;