import { useState, useEffect } from "react";
import axios from "axios";

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

const useFetchStocks = (filters: StockFilters) => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [taskStatus, setTaskStatus] = useState<string>("idel"); // Track task status, default to "idel"
  const [isPolling, setIsPolling] = useState<boolean>(false); // Track if polling is in progress

  // Function to fetch stocks
  const fetchStocks = async () => {
    try {
      setIsLoading(true);
      setError(""); // Clear previous errors
      await axios.post(`http://194.164.148.248:8000/allstocks`, filters);

      // Start polling to check status
      pollForStatus();
    } catch (err) {
      setIsLoading(false);
      console.error("Error fetching stocks:", err);
      setError("Failed to fetch stocks. Please try again later.");
    }
  };

  // Function to poll for status
  const pollForStatus = async () => {
    if (isPolling) return; // Skip polling if there's already an ongoing request
    setIsPolling(true); // Mark polling as in progress

    const interval = setInterval(async () => {
      try {
        const statusResponse = await axios.get(
          `http://194.164.148.248:8000/check_status`
        );
        const { status, data } = statusResponse.data;

        if (status === "idel") {
          setStocks(data); // Set the fetched stocks data if task is completed
          setIsLoading(false);
          setTaskStatus("idel");
          setIsPolling(false); // Reset polling flag
          clearInterval(interval); // Stop polling when task is idle (completed)
        } else if (status === "running") {
          setTaskStatus("running"); // Continue polling if the task is still running
        }
      } catch (err) {
        console.error("Error checking task status:", err);
        setError("Failed to check task status. Please try again later.");
        setIsLoading(false);
        setIsPolling(false); // Reset polling flag on error
        clearInterval(interval); // Stop polling on error
      }
    }, 10000); // Poll every 5 seconds
  };

  // Use effect to check the status when component mounts
  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        setIsLoading(true);
        const statusResponse = await axios.get(
          `http://194.164.148.248:8000/check_status`
        );
        const { status, data } = statusResponse.data;

        if (status === "idel") {
          setStocks(data); // Set the fetched stocks data if task is completed
          setTaskStatus("idel"); // Task is idle, no need for polling
          setIsLoading(false);
        } else if (status === "running") {
          setTaskStatus("running");
          pollForStatus(); // Start polling if the task is in progress
        }
      } catch (err) {
        console.error("Error checking task status:", err);
        setIsLoading(false);
        setError("Failed to check task status. Please try again later.");
      }
    };

    checkInitialStatus();
  }, []); // Empty dependency array means this runs only on component mount

  return {
    stocks,
    error,
    isLoading,
    taskStatus,
    fetchStocks,
  };
};

export default useFetchStocks;
