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
  const [taskStatus, setTaskStatus] = useState<string>("pending"); // Track task status

  // Function to fetch stocks
  const fetchStocks = async () => {
    try {
      setIsLoading(true);
      setError(""); // Clear previous errors
      await axios.post("http://127.0.0.1:8000/allstocks", filters);
      
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
    const interval = setInterval(async () => {
      try {
        const statusResponse = await axios.get("http://127.0.0.1:8000/check_status");
        const { status, data } = statusResponse.data;
        
        if (status === "completed") {
          setStocks(data); // Set the fetched stocks data
          setIsLoading(false);
          setTaskStatus("completed");
          clearInterval(interval); // Stop polling when task is completed
        } else if (status === "error") {
          setError("Error occurred while fetching stocks.");
          setIsLoading(false);
          setTaskStatus("error");
          clearInterval(interval); // Stop polling on error
        }
      } catch (err) {
        console.error("Error checking task status:", err);
        setError("Failed to check task status. Please try again later.");
        setIsLoading(false);
        clearInterval(interval); // Stop polling on error
      }
    }, 5000); // Poll every 5 seconds
  };

  // Use effect to check the status when component mounts
  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        const statusResponse = await axios.get("http://127.0.0.1:8000/check_status");
        const { status, data } = statusResponse.data;

        if (status === "completed") {
          setStocks(data); // Set the fetched stocks data if task is completed
          setTaskStatus("completed");
        } else if (status === "in-progress") {
          setTaskStatus("in-progress");
          pollForStatus(); // Start polling if the task is in progress
        }
      } catch (err) {
        console.error("Error checking task status:", err);
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
