import React, { useState } from "react";
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import RecommendationCard from "../components/RecommendationCard";
import StockFiltersBox from "../components/StockFiltersBox";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useFetchRecommendations } from "../hooks/useFetchRecommendations"; // Import custom hook

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
    modelType: string; // "normal" or "Epoch"
}

export const handleCopy = async (recommendations: unknown[]) => {
    try {
        const jsonString = JSON.stringify(recommendations, null, 2); // Convert JSON to a string
        await navigator.clipboard.writeText(jsonString); // Copy to clipboard
        alert("JSON copied to clipboard!");
    } catch (error) {
        console.error("Failed to copy JSON:", error);
        alert("Failed to copy JSON.");
    }
};

const NewsRecommendedStocks: React.FC = () => {
    const [filters, setFilters] = useState<StockFilters>({
        num_stocks: 10,
        industry: [],
        index: [],
        market_cap: { min: 50000000000, max: 3000000000000000 },
        fromDate: new Date(), // Current timestamp
        toDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours back
        modelType: "normal",
    });

    // Use custom hook
    const {
        recommendations,
        error,
        isLoading,
        fetchingInProgress,
        fetchRecommendations
    } = useFetchRecommendations(filters);

    const handleChange = (field: keyof StockFilters, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const [filter, setFilter] = useState<string>("all");

    const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setFilter(event.target.value as string);
    };

    const filteredRecommendations = recommendations.filter((rec: any) => {
        if (filter === "all") return true; // Show all if "all" is selected
        return rec.newsImpact.toLowerCase() === filter;
    });

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
            <Typography variant="h4" gutterBottom>
                Stock Recommendations
            </Typography>

            <StockFiltersBox filters={filters} onChange={handleChange} />

            <Button
                variant="contained"
                sx={{
                    mt: 3,
                    backgroundColor: "#555555",
                    color: "#ffffff",
                    "&:hover": { backgroundColor: "#777777" },
                }}
                onClick={fetchRecommendations}
                startIcon={isLoading && <CircularProgress color="info" size="20px" />}
                disabled={isLoading || fetchingInProgress} // Disable while fetching or in progress
            >
                Fetch Recommendations
            </Button>

            {error && (
                <Typography color="error" sx={{ mb: 3 }}>
                    {error}
                </Typography>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
                {recommendations.length > 0 ? (
                    <>
                        <Box>
                            <Button
                                variant="contained"
                                onClick={() => handleCopy(recommendations)}
                                startIcon={<ContentCopyIcon />}
                            >
                                Copy Raw
                            </Button>
                            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Filter</InputLabel>
                                <Select
                                    value={filter}
                                    onChange={handleFilterChange}
                                    label="Filter"
                                    sx={{
                                        backgroundColor: "#333333",
                                        color: "#ffffff",
                                    }}
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="positive">Positive</MenuItem>
                                    <MenuItem value="neutral">Neutral</MenuItem>
                                    <MenuItem value="negative">Negative</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {filteredRecommendations.map((rec, index) => (
                            <RecommendationCard
                                key={index}
                                companyName={rec.companyName}
                                newsImpact={rec.newsImpact}
                                impactReason={rec.impactReason}
                            />
                        ))}
                    </>

                ) : (
                    <Typography>No recommendations fetched yet.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default NewsRecommendedStocks;
