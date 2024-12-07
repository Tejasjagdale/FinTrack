import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { CompanyNewsCard } from "../components/CompanyNewsCard";
import StockFilter from "../components/StockFiltersBox"; // Import custom hook
import useFetchStocks from "../hooks/useFetchStocks";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { handleCopy } from "./NewsRecommendedStocks";

interface MarketCap {
  min: number;
  max: number;
}

interface StockFilters {
  num_stocks: number;
  industry: string[];
  index: string[];
  market_cap: MarketCap;
  fromDate: Date;
  toDate: Date;
}

const StockFetcher: React.FC = () => {
  const [filters, setFilters] = useState<StockFilters>({
    num_stocks: 10,
    industry: [],
    index: [],
    market_cap: { min: 50000000000, max: 3000000000000000 },
    fromDate: new Date(), // Current timestamp
    toDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours back
  });

  // Use the custom hook to fetch stocks data
  const { stocks, error, isLoading, taskStatus, fetchStocks } = useFetchStocks(filters);

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
        sx={{
          mt: 3,
          backgroundColor: "#555555",
          color: "#ffffff",
          "&:hover": { backgroundColor: "#777777" },
        }}
        onClick={fetchStocks}
        startIcon={isLoading && <CircularProgress color="info" size="20px" />}
        disabled={isLoading || taskStatus === "in-progress"}
      >
        Fetch Stocks
      </Button>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {taskStatus === "in-progress" && (
        <Typography sx={{ mt: 2 }}>Fetching stocks, please wait...</Typography>
      )}

      {taskStatus === "error" && (
        <Typography color="error" sx={{ mt: 2 }}>
          Error occurred. Please try again later.
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
        <Typography variant="h6">Fetched Stocks</Typography>
        {stocks.length > 0 ?
          <><Button
            variant="contained"
            onClick={() => handleCopy(stocks)}
            startIcon={<ContentCopyIcon />}
            sx={{ marginBottom: "2px" }}
          >
            Copy Raw
          </Button>{stocks?.map((stock, index) => <CompanyNewsCard key={index} data={stock} />)}</>
          : (
            <Typography>No stocks fetched yet.</Typography>
          )}
      </Box>
    </Box>
  );
};

export default StockFetcher;
