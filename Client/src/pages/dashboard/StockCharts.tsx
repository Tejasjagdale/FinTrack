import React from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Grid } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

// Type definitions
interface Value {
    [index: number]: string | number;
}

interface Dataset {
    metric: string;
    label: string;
    values: Value[];
}

interface StockChartsProps {
    datasets: Dataset[];
}

const StockCharts: React.FC<StockChartsProps> = ({ datasets }) => {
    // Prepare data for the Line Chart (Price, 50 DMA, 200 DMA)
    const lineChartData = {
        labels: datasets[0].values.map((value) => value[0] as string), // Extract dates from the first dataset
        datasets: datasets
            .filter((ds) => ds.metric !== 'Volume')
            .map((ds) => ({
                label: ds.label,
                data: ds.values.map((value) => parseFloat(value[1] as string)), // Extract price values
                borderColor:
                    ds.metric === 'Price'
                        ? 'rgba(75, 192, 192, 1)'
                        : ds.metric === 'DMA50'
                            ? 'rgba(153, 102, 255, 1)'
                            : 'rgba(255, 159, 64, 1)', // Different colors for each line
                backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
                borderWidth: 2,
                tension: 0.3,
            })),
    };

    // Prepare data for the Bar Chart (Volume)
    const volumeDataset = datasets.find((ds) => ds.metric === 'Volume');
    const barChartData = {
        labels: volumeDataset?.values.map((value) => value[0] as string) || [],
        datasets: [
            {
                label: 'Volume',
                data: volumeDataset?.values.map((value) => value[1] as number) || [],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Value',
                },
            },
        },
    };

    return (
        <Grid sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'stretch' }}>
            <h2>Price, 50 DMA, and 200 DMA - Line Chart</h2>
            <Grid width={"100%"}>
                <Line data={lineChartData} options={options} />
            </Grid>
            <h2>Volume - Bar Chart</h2>
            <Bar data={barChartData} options={options} />
        </Grid>
    );
};

export default StockCharts;
