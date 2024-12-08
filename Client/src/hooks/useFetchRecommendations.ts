import { useState, useEffect } from "react";
import axios from "axios";

interface StockFilters {
  num_stocks: number;
  industry: string[];
  index: string[];
  market_cap: { min: number; max: number };
  fromDate: Date;
  toDate: Date;
  modelType: string; // "normal" or "Epoch"
}

interface Recommendation {
  companyName: string;
  newsImpact: string;
  impactReason: string;
}

export const useFetchRecommendations = (filters: StockFilters) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchingInProgress, setFetchingInProgress] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(false); // Track if polling is in progress

  // Function to start fetching recommendations
  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(""); // Clear previous errors
      setFetchingInProgress(true); // Set the state to show fetching is in progress

      // Start fetching recommendations
      await axios.post(
        "http://127.0.0.1:8000/get/stocks/Recommendation/news",
        filters
      );

      // Start polling to check the status
      pollRecommendationStatus();
    } catch (err) {
      setIsLoading(false);
      console.error("Error fetching recommendations:", err);
      setError("Failed to fetch recommendations. Please try again later.");
    }
  };

  // Function to poll the status
  const pollRecommendationStatus = async () => {
    // Prevent polling if an API call is still pending
    if (isPolling) return;
    setIsPolling(true); // Mark polling as in progress

    try {
      const intervalId = setInterval(async () => {
        const response = await axios.get(
          "http://127.0.0.1:8000/check_recommendation_status"
        );

        if (response.data.status === "idel") {
          clearInterval(intervalId); // Stop polling when "idel"
          const finaldata = response.data.data.map((item: string) => {
            const [, companyName, newsImpact, impactReason] =
              item.match(
                /companyName:\s*(.*?),\s*newsImpact:\s*(.*?),\s*impactReason:\s*(.*)/
              ) || [];
            return { companyName, newsImpact, impactReason };
          });
          setRecommendations(finaldata); // Set the recommendations data
          setIsLoading(false);
          setFetchingInProgress(false);
          setIsPolling(false); // Reset polling flag
        } else if (response.data.status === "error") {
          clearInterval(intervalId);
          setError("Error fetching recommendations. Please try again later.");
          setIsLoading(false);
          setFetchingInProgress(false);
          setIsPolling(false); // Reset polling flag
        }
      }, 10000); // Poll every 5 seconds
    } catch (err) {
      setIsLoading(false);
      setError("Error checking recommendation status. Please try again later.");
      setIsPolling(false); // Reset polling flag
    }
  };

  // Initial useEffect to check task status
  useEffect(() => {
    const checkInitialRecommendationStatus = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/check_recommendation_status"
        );
        const { status, data } = response.data;

        if (status === "idel") {
          const finaldata = data.map((item: string) => {
            const [, companyName, newsImpact, impactReason] =
              item.match(
                /companyName:\s*(.*?),\s*newsImpact:\s*(.*?),\s*impactReason:\s*(.*)/
              ) || [];
            return { companyName, newsImpact, impactReason };
          });
          setRecommendations(finaldata); // Set the fetched recommendations
          setFetchingInProgress(false);
          setIsPolling(false); // Reset polling flag
        } else if (status === "running") {
          setFetchingInProgress(true);
          pollRecommendationStatus(); // Start polling if the task is in progress
        }
      } catch (err) {
        console.error("Error checking initial recommendation status:", err);
        setError(
          "Failed to check initial recommendation status. Please try again later."
        );
      }
    };

    checkInitialRecommendationStatus();
  }, []); // Run once on component mount

  return {
    recommendations,
    error,
    isLoading,
    fetchingInProgress,
    fetchRecommendations,
  };
};
