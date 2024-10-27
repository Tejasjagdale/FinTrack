import { Grid, Typography } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"

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

    return (
        <Grid>
            {user?.avatar_url != null ?
                <><Typography>Welcome {user?.name}</Typography>
                    <img src={user?.avatar_url} alt="user" /></> :
                <><Typography>Welcome {user?.name}</Typography>
                    <img src={user?.picture} alt="user" /></>
            }
        </Grid>
    )
}

export default UserDetails