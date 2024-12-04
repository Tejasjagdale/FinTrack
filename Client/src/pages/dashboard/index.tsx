import { Button, Grid, Input, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import StockCharts from './StockCharts'
import companyData from './data.json';
import { fetchStockData } from '../../services/fetchStockData';
import axios from 'axios';

interface Dataset {
    metric: string;
    label: string;
    values: [string, number | string | number[]][];
}

interface ApiResponse {
    datasets: Dataset[];
}

function index({ signedInWith }: any) {

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const query = "Price-DMA50-DMA200-Volume"
    const [days, setDays] = useState<string | null | unknown>(null)
    const [companyId, setCompanyId] = useState<string | null | unknown>(null);

    const handleAddDays = (e: any) => {
        setDays(e.target.value)
    }

    const handleSearchQuery = () => {
        if (companyId && days) {
            axios
                .get('http://localhost:8089/v1/finTrack/stockdata?companyId=' + companyId + "&query=" + query + "&days=" + days, {
                    withCredentials: true,
                })
                .then((response) => {
                    setData(response.data.datasets);
                    setLoading(false);
                })
                .catch((error) => {
                    setError('Error fetching data');
                    setLoading(false);
                });
        }
    }

    return (
        <Grid width={"100%"}>
            <Typography>Stock Data</Typography>
            <Typography>Select Your Stocks</Typography>
            <Grid sx={{ display: 'flex', flexDirection: 'column' }}>
                {Object.entries(companyData.nifty50.companies).map(([companyName, companyValue]: [string, unknown], index) => {
                    return (
                        <Button key={index} onClick={() => setCompanyId(companyValue)}>
                            {companyName}
                        </Button>
                    );
                })}
                <TextField
                    label="Enter a number"
                    variant="outlined"
                    value={days}
                    onChange={handleAddDays}
                    type="number"
                    fullWidth
                    color='primary'
                    inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        style: { color: 'white' } // Set text color to white
                    }}
                    sx={{
                        '& .MuiInputLabel-root': { color: 'white' }, // Label color
                        '& .MuiOutlinedInput-root': {
                            '& input': {
                                color: 'white', // Input text color
                            },
                            '& fieldset': {
                                borderColor: 'white', // Border color
                            },
                        },
                    }}
                />
            </Grid>
            <Button onClick={handleSearchQuery}>Search</Button>
            {data && <StockCharts datasets={data} />}
        </Grid>
    )
}

export default index