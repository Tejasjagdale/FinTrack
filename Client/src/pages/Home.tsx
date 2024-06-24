import { Box, Button } from '@mui/material'
import viteLogo from '/beaverimg.png'

const Home = () => {
    return (
        <>
            <div>
                <img src={viteLogo} className="logo" alt="Vite logo" />
            </div>
            <h1>Wellcome to <b style={{ color: "#476EE2" }}>FinTrack</b></h1>
            <div className="card">
                <p>
                    A comprehensive app for tracking expenses, managing income, setting budgets,<br />
                    and achieving savings goals with real-time insights and secure, user-friendly features.
                </p>
            </div>
            <Box sx={{
                display: "flex",
                width: "50%",
                justifyContent:"space-around",
                margin:"auto"
            }}>
                <Button variant="contained">Login</Button>
                <Button variant="outlined">SignUp</Button>
            </Box>
        </>
    )
}

export default Home