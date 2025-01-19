import React, { useEffect, useState } from "react";
import { Grid, Typography, CircularProgress, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import LiveMintStockCard from "../components/LiveMintStockCard";

// Interface for the stock data structure
interface StockData {
  date: string;
  displayName: string;
  description: string;
  overallRating: string;
  longTermTrends: string;
  shortTermTrends: string;
}

const LivemintDataFetcher: React.FC = () => {
  const [data, setData] = useState<StockData[]>([]);
  const [filteredData, setFilteredData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOverallRating, setSelectedOverallRating] = useState<string>("");
  const [selectedLongTermTrend, setSelectedLongTermTrend] = useState<string>("");
  const [selectedShortTermTrend, setSelectedShortTermTrend] = useState<string>("");

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/livemint");
        if (response.ok) {
          const result = await response.json();
          setData(result.liveMintRecommendations || []); // Use unified list from backend
          setFilteredData(result.livemintRecommendations || []);
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

  // Update filtered data based on selected filters
  useEffect(() => {
    setFilteredData(
      data.filter((item) => {
        const overallRatingMatch = selectedOverallRating
          ? item.overallRating === selectedOverallRating
          : true;
        const longTermTrendMatch = selectedLongTermTrend
          ? item.longTermTrends === selectedLongTermTrend
          : true;
        const shortTermTrendMatch = selectedShortTermTrend
          ? item.shortTermTrends === selectedShortTermTrend
          : true;

        return overallRatingMatch && longTermTrendMatch && shortTermTrendMatch;
      })
    );
  }, [selectedOverallRating, selectedLongTermTrend, selectedShortTermTrend, data]);

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

  // Extract unique filter options from data
  const uniqueOverallRatings = Array.from(new Set(data.map((item) => item.overallRating)));
  const uniqueLongTermTrends = Array.from(new Set(data.map((item) => item.longTermTrends)));
  const uniqueShortTermTrends = Array.from(new Set(data.map((item) => item.shortTermTrends)));

  return (
    <Box sx={{ padding: 3, backgroundColor: "#242424", color: "white" }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        LiveMint Stock Recommendations
      </Typography>

      {/* Advanced Filters */}
      <Box display="flex" justifyContent="center" gap={2} marginBottom={3} flexWrap="wrap">
        {/* Overall Rating Filter */}
        <FormControl variant="outlined" sx={{ minWidth: 200, backgroundColor: "#333", color: "white" }}>
          <InputLabel sx={{ color: "white" }}>Overall Rating</InputLabel>
          <Select
            value={selectedOverallRating}
            onChange={(e) => setSelectedOverallRating(e.target.value)}
            sx={{
              color: "white",
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueOverallRatings.map((rating, index) => (
              <MenuItem key={index} value={rating}>
                {rating}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Long Term Trends Filter */}
        <FormControl variant="outlined" sx={{ minWidth: 200, backgroundColor: "#333", color: "white" }}>
          <InputLabel sx={{ color: "white" }}>Long Term Trend</InputLabel>
          <Select
            value={selectedLongTermTrend}
            onChange={(e) => setSelectedLongTermTrend(e.target.value)}
            sx={{
              color: "white",
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueLongTermTrends.map((trend, index) => (
              <MenuItem key={index} value={trend}>
                {trend}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Short Term Trends Filter */}
        <FormControl variant="outlined" sx={{ minWidth: 200, backgroundColor: "#333", color: "white" }}>
          <InputLabel sx={{ color: "white" }}>Short Term Trend</InputLabel>
          <Select
            value={selectedShortTermTrend}
            onChange={(e) => setSelectedShortTermTrend(e.target.value)}
            sx={{
              color: "white",
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueShortTermTrends.map((trend, index) => (
              <MenuItem key={index} value={trend}>
                {trend}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Grid to render stock cards */}
      <Grid container spacing={2}>
        {filteredData.map((item, index) => (
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
