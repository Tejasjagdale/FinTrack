import { Button, Grid, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function UserDetails({ signedInWith }: { signedInWith: string }) {

    interface UserDetails {
        name: string,
        picture: string,
        email: string
        avatar_url: string
    }

    const [user, setUser] = useState<UserDetails>()

    useEffect(() => {
        axios.get("http://localhost:8089/v1/finTrack/user-details", { withCredentials: true }).then((res) => setUser(res?.data))
    }, [])
    console.log(signedInWith);

    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate("/dashboard")
    }
    return (
        <Grid>
            <Typography>Welcome {user?.name}</Typography>
            <Button onClick={handleNavigate} variant="contained">Navigate to App</Button>
        </Grid>
    )
}

export default UserDetails