import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import viteLogo from '/beaverimg.png';
import axios from 'axios';
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io";


type HomeProps = {
    setSignedInWith: React.Dispatch<React.SetStateAction<string>>;
};

const Home = ({ setSignedInWith }: HomeProps | null | undefined) => {
    const navigate = useNavigate();
    const handleGetRoles = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        if (token) {
            try {
                const response = await axios.get('http://localhost:8089/v1/finTrack/get-roles', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Set the Authorization header
                    },
                });
                console.log('Roles:', response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        }
        else {
            console.error('No token found');
        }
    };
    const handleSignInWithGoogle = () => {
        window.location.href = 'http://localhost:8089/oauth2/authorization/google'
        // setSignedInWith("google")
    }
    const handleSignInWithGitHub = () => {
        window.location.href = 'http://localhost:8089/oauth2/authorization/github'
        // setSignedInWith("github")
    }

    return (
        <>
            <div>
                <img src={viteLogo} className="logo" alt="Vite logo" />
            </div>
            <h1>Welcome to <b style={{ color: "#476EE2" }}>FinTrack</b></h1>
            <div className="card">
                <p>
                    A comprehensive app for tracking expenses, managing income, setting budgets,<br />
                    and achieving savings goals with real-time insights and secure, user-friendly features.
                </p>
            </div>
            <Box sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-around",
                margin: "auto"
            }}>
                <Button variant="contained" onClick={() => navigate('/login')}>Login</Button>
                <Button variant="outlined" onClick={() => navigate('/signup')}>SignUp</Button>
                <Button variant="contained" color='warning' onClick={() => navigate('/stocks/all')}>All stocks</Button>
                <Button variant="outlined" color="success" onClick={() => navigate('/stocks/recommendation/news')}>stocks Recommendation</Button>
            </Box>
        </>
    )
}

export default Home;
