import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { CompanyNewsCard } from "../components/CompanyNewsCard";
import StockFilter from "../components/StockFiltersBox";

interface MarketCap {
  min: number;
  max: number;
}

interface StockFilters {
  num_stocks: number;
  industry: string[];
  index: string[];
  market_cap: MarketCap;
}

const StockFetcher: React.FC = () => {
  const [filters, setFilters] = useState<StockFilters>({
    num_stocks: 10,
    industry: [],
    index: [],
    market_cap: { min: 50000000000, max: 3000000000000000 },
  });
  const [stocks, setStocks] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchStocks = async () => {
    try {
      setIsLoading(true)
      setError(""); // Clear previous errors
      const response = await axios.post("https://fin-track-ai.vercel.app/allstocks", filters);
      setStocks(response.data);
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      console.error("Error fetching stocks:", err);
      setError("Failed to fetch stocks. Please try again later.");
    }
  };

  const handleChange = (field: keyof StockFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#242424",
        color: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <StockFilter filters={filters} onChange={handleChange} />
      <Button
        variant="contained"
        sx={{ mt: 3, backgroundColor: "#555555", color: "#ffffff", "&:hover": { backgroundColor: "#777777" } }}
        onClick={fetchStocks}
        startIcon={isLoading && <CircularProgress color="info" size="20px" />}
        disabled={isLoading}
      >
        Fetch Stocks
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">Fetched Stocks</Typography>
        {stocks.length > 0 ?
          stocks?.map((stock) => {
            return <CompanyNewsCard data={stock} />
          })
          : (
            <Typography>No stocks fetched yet.</Typography>
          )}
      </Box>
    </Box>
  );
};

export default StockFetcher;
