import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token); // Store the token in local storage
            navigate('/'); // Redirect to the home page or dashboard
        } else {
            navigate('/login'); // Redirect to the login page if no token found
        }
    }, [navigate]);

    return <div>Loading...</div>;
};

export default OAuth2RedirectHandler;
