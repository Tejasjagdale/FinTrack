import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale,
} from 'chart.js';

// Register chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale);

const CandleChart: React.FC = () => {
  const [data, setData] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          '/api/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH/ZOMATO/daily',
          { params: { intervalInMinutes: 1, minimal: true } }
        );
        setData(response.data.candles);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data.map((candle) =>
      new Date(candle[0] * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [
      {
        label: 'Price',
        data: data.map((candle) => candle[1]),
        borderColor: '#4caf50', // Green color
        backgroundColor: 'rgba(76, 175, 80, 0.2)', // Light green fill
        pointBackgroundColor: '#4caf50',
        tension: 0.3, // Smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#FFFFFF', // White legend text
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF', // White x-axis labels
        },
        grid: {
          color: '#555555', // Gray grid lines
        },
      },
      y: {
        ticks: {
          color: '#FFFFFF', // White y-axis labels
        },
        grid: {
          color: '#555555', // Gray grid lines
        },
      },
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: '#242424',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {loading ? (
        <CircularProgress sx={{ color: '#FFFFFF' }} />
      ) : (
        <>
          <Typography
            variant="h5"
            sx={{
              color: '#FFFFFF',
              marginBottom: '20px',
            }}
          >
            Candle Chart for ZOMATO
          </Typography>
          <Box
            sx={{
              width: '100%',
              maxWidth: '800px',
              backgroundColor: '#333333',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            <Line data={chartData} options={options} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default CandleChart;