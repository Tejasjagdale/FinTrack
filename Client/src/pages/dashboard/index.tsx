import React, { useEffect, useState } from "react";
import { Box, AppBar, Toolbar, Tabs, Tab, Drawer, List, ListItem, ListItemText, useMediaQuery, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NewsRecommendedStocks from "../NewsRecommendedStocks";
import StockFetcher from "../StockFetcher";

const theme = createTheme({
    palette: {
        mode: "dark",
        background: { default: "#242424", paper: "#333333" },
        primary: { main: "#ffffff" },
    },
});

const menuItems = ["Home", "StockNews", "Recommendation", "LiveMint"];

const Dashboard: React.FC = () => {
    const [selectedMenu, setSelectedMenu] = useState("Home");
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleMenuClick = (menu: string) => {
        setSelectedMenu(menu);

        window.history.replaceState(null, "", `#${menu}`);
    };

    const renderContent = () => {
        switch (selectedMenu) {
            case "Home":
                return <Typography variant="h6">Select a Menu</Typography>;
            case "StockNews":
                return <StockFetcher />;
            case "Recommendation":
                return <NewsRecommendedStocks />
            default:
                return <></>;
        }
    };

    useEffect(() => {
        // Check the hash in the URL
        const hash = window.location.hash.slice(1); // Remove the "#" from the hash
        if (hash) {
            setSelectedMenu(hash);
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: theme.palette.background.default }}>
                {isMobile ? (
                    <>
                        <AppBar position="static">
                            <Toolbar>
                                <Tabs
                                    value={selectedMenu}
                                    onChange={(e, value) => handleMenuClick(value)}
                                    textColor="inherit"
                                    indicatorColor="primary"
                                    variant="scrollable"
                                >
                                    {menuItems.map((menu) => (
                                        <Tab key={menu} label={menu} value={menu} />
                                    ))}
                                </Tabs>
                            </Toolbar>
                        </AppBar>
                        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.background.default, color: "#fff" }}>
                            {renderContent()}
                        </Box>
                    </>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "row", flexGrow: 1 }}>
                        <Drawer
                            variant="permanent"
                            sx={{
                                width: 240,
                                "& .MuiDrawer-paper": { width: 240, backgroundColor: theme.palette.background.paper, color: "#fff" },
                            }}
                        >
                            <List>
                                {menuItems.map((menu) => (
                                    <ListItem button key={menu} onClick={() => handleMenuClick(menu)}>
                                        <ListItemText primary={menu} />
                                    </ListItem>
                                ))}
                            </List>
                        </Drawer>
                        <Box
                            sx={{
                                flexGrow: 1,
                                p: 3,
                                backgroundColor: theme.palette.background.default,
                                color: "#fff",
                            }}
                        >
                            {renderContent()}
                        </Box>
                    </Box>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default Dashboard;
