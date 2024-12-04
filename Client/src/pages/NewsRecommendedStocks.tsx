import React, { useState } from "react";
import axios from "axios";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import RecommendationCard from "../components/RecommendationCard";
import StockFiltersBox from "../components/StockFiltersBox";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface Recommendation {
    companyName: string;
    newsImpact: string;
    impactReason: string;
}

interface MarketCap {
    min: number;
    max: number;
}

interface StockFilters {
    num_stocks: number;
    industry: string[];
    index: string[];
    market_cap: MarketCap;
    modelType: string; // "normal" or "Epoch"
}

const NewsRecommendedStocks: React.FC = () => {
    const [filters, setFilters] = useState<StockFilters>({
        num_stocks: 10,
        industry: [],
        index: [],
        market_cap: { min: 50000000000, max: 3000000000000000 },
        modelType: "normal",
    });
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false)


    const fetchRecommendations = async () => {
        try {
            setIsLoading(true)
            setError(""); // Clear previous errors
            const response = await axios.post(
                "https://fin-track-ai.vercel.app/get/stocks/Recommendation/news",
                filters
            );

            // Parse API response to structured data
            const data = response.data.map((item: string) => {
                const [, companyName, newsImpact, impactReason] =
                    item.match(
                        /companyName:\s*(.*?),\s*newsImpact:\s*(.*?),\s*impactReason:\s*(.*)/
                    ) || [];
                return { companyName, newsImpact, impactReason };
            });

            setRecommendations(data);
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            console.error("Error fetching recommendations:", err);
            setError("Failed to fetch recommendations. Please try again later.");
        }
    };

    const handleChange = (field: keyof StockFilters, value: any) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleCopy = async () => {
        try {
          const jsonString = JSON.stringify(recommendations, null, 2); // Convert JSON to a string
          await navigator.clipboard.writeText(jsonString); // Copy to clipboard
          alert("JSON copied to clipboard!");
        } catch (error) {
          console.error("Failed to copy JSON:", error);
          alert("Failed to copy JSON.");
        }
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
                disabled={isLoading}
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
                        <Button
                            variant="contained"
                            onClick={handleCopy}
                            startIcon={<ContentCopyIcon />}
                        >
                            Copy Raw
                        </Button>
                        {recommendations.map((rec, index) => (
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
