import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { Button, ButtonGroup, Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme } from "@mui/material";

interface StockChartModalProps {
  open: boolean;
  onClose: () => void;
  companyName: string;
}

const StockChartModal: React.FC<StockChartModalProps> = ({ open, onClose, companyName }) => {
  const [data, setData] = useState<{ candles: [number, number][], changeValue: number, changePerc: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<string>("weekly");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Mobile-friendly full-screen modal

  const fetchStockChartData = async (timeline: string) => {
    try {
      setError(null);
      const response = await axios.get(
        `https://fin-track-ai.vercel.app/api/stock-chart`,
        {
          params: { stock_name: companyName, timeline: timeline },
        }
      );
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch stock data.");
    }
  };

  useEffect(() => {
    if (open) {
      fetchStockChartData(selectedTimeline);
    }
  }, [open, selectedTimeline]);

  if (error && open) return <p style={{ color: "red" }}>{error}</p>;

  const series = [
    {
      name: "Price",
      data: data?.candles.map(([timestamp, price]) => ({
        x: new Date(timestamp * 1000).toISOString(),
        y: price,
      })) || [],
    },
  ];

  const lineColor = data && data.changeValue > 0 ? "#00FF00" : "#FF0000";

  const options = {
    chart: {
      type: "line",
      toolbar: { show: true },
      background: "#242424",
      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: true,
      },
    },
    theme: { mode: "dark" },
    xaxis: {
      type: "datetime",
      labels: { style: { colors: "#FFFFFF" } },
    },
    yaxis: {
      labels: { style: { colors: "#FFFFFF" } },
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: [lineColor],
    },
    tooltip: {
      x: { format: "dd MMM yyyy HH:mm" },
    },
  };

  const timelineOptions = [
    { label: "1W", value: "weekly" },
    { label: "1M", value: "monthly" },
    { label: "3M", value: "3months" },
    { label: "6M", value: "6months" },
    { label: "1Y", value: "1year" },
    { label: "3Y", value: "3years" },
    { label: "5Y", value: "5years" },
    { label: "All", value: "all" },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile} // Full-screen on mobile
      maxWidth="lg"
      fullWidth={!isMobile}
      PaperProps={{
        style: {
          backgroundColor: "#242424",
          color: "#FFFFFF",
        },
      }}
    >
      <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
        {companyName} Stock Chart 
        <Button color="error" onClick={onClose}>Close</Button>
      </DialogTitle>
      <DialogContent>
        <ButtonGroup variant="outlined" size="small" style={{ marginBottom: "10px" }}>
          {timelineOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedTimeline(option.value)}
              style={{
                backgroundColor: selectedTimeline === option.value ? "#555555" : "#333333",
                color: "#FFFFFF",
                border: "1px solid #444444",
                marginRight: "4px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              {option.label}
            </button>
          ))}
        </ButtonGroup>
        <ReactApexChart options={options} series={series} type="line" height={350} />
      </DialogContent>
    </Dialog>
  );
};

export default StockChartModal;
