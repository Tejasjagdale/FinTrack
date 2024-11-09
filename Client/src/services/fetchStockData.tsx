// src/services/stockService.ts
import axios from 'axios';

interface ApiResponse {
    datasets: Array<{
        metric: string;
        label: string;
        values: Array<[string, number | string | number[]]>;
        meta: Record<string, any>;
    }>;
}

const BASE_URL = 'https://www.screener.in/api/company/100068/chart/';

/**
 * Fetch stock data from the Screener API.
 * @returns {Promise<ApiResponse>}
 */
export const fetchStockData = async (): Promise<ApiResponse> => {
    try {
        const queryParams = {
            q: 'Price-DMA50-DMA200-Volume',
            days: 30,
            consolidated: true,
        };

        const response = await axios.get<ApiResponse>(BASE_URL, { params: queryParams });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching stock data:', error);
        throw new Error('Failed to fetch stock data');
    }
};
