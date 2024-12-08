import React, { useEffect, useState } from "react";
import { Grid, MenuItem, Select, Typography, CircularProgress, Box } from "@mui/material";
import LiveMintStockCard from "../components/LiveMintStockCard";

// Interface for the data structure
interface StockData {
  date: string;
  displayName: string;
  description: string;
  overallRating: string;
  longTermTrends: string;
  shortTermTrends: string;
}

const LivemintDataFetcher: React.FC = () => {
  const [data, setData] = useState<{
    nse_top_gainer_losers: StockData[];
    top_gainer_losers: StockData[];
    nse_market_vol_most_active: StockData[];
    market_vol_most_active: StockData[];
    price_volume_shocker: StockData[];
  }>({
    nse_top_gainer_losers: [],
    top_gainer_losers: [],
    nse_market_vol_most_active: [],
    market_vol_most_active: [],
    price_volume_shocker: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("nse_top_gainer_losers");

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://fin-track-ai.vercel.app/livemint");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          setError("Failed to fetch data");
        }
      } catch (error) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Typography color="error" textAlign="center" variant="h6">
        {error}
      </Typography>
    );
  }

  // Get the currently selected data array
  const selectedData = data[selectedTopic as keyof typeof data] || [];

  return (
    <Box sx={{ padding: 3, backgroundColor: "#242424", color: "white" }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        LiveMint Stock Data
      </Typography>

      {/* Dropdown for selecting a topic */}
      <Box textAlign="center" marginBottom={3}>
        <Select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          sx={{
            backgroundColor: "#333",
            color: "white",
            "& .MuiSelect-icon": { color: "white" },
          }}
        >
          <MenuItem value="nse_top_gainer_losers">NSE Top Gainers & Losers</MenuItem>
          <MenuItem value="top_gainer_losers">Top Gainers & Losers</MenuItem>
          <MenuItem value="nse_market_vol_most_active">NSE Market Volume Most Active</MenuItem>
          <MenuItem value="market_vol_most_active">Market Volume Most Active</MenuItem>
          <MenuItem value="price_volume_shocker">Price Volume Shocker</MenuItem>
        </Select>
      </Box>

      {/* Grid to render cards */}
      <Grid container spacing={2}>
        {selectedData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
            <LiveMintStockCard
              date={item.date}
              displayName={item.displayName}
              description={item.description}
              overallRating={item.overallRating}
              longTermTrends={item.longTermTrends}
              shortTermTrends={item.shortTermTrends}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LivemintDataFetcher;
