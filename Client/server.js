import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 5000;

app.use(cors());

// Proxy route for search API
app.get('/api/search', async (req, res) => {
  const { query, from, size } = req.query;

  try {
    const response = await axios.get(
      'https://groww.in/v1/api/search/v3/query/stocks/st_query',
      { params: { query, from, size, web: true } }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching search data:', error.message);
    res.status(500).json({ error: 'Failed to fetch search data' });
  }
});

// Proxy route for candle data API
app.get('/api/candle', async (req, res) => {
  const { exchange, segment, symbol, intervalInMinutes, minimal } = req.query;

  try {
    const response = await axios.get(
      `https://groww.in/v1/api/charting_service/v2/chart/exchange/${exchange}/segment/${segment}/${symbol}/daily`,
      { params: { intervalInMinutes, minimal } }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching candle data:', error.message);
    res.status(500).json({ error: 'Failed to fetch candle data' });
  }
});

app.get('/api/companyDetails', async (req, res) => {
  const {  search_id } = req.query;

  try {
    const response = await axios.get(
      `https://groww.in/v1/api/stocks_data/v1/company/search_id/${search_id}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching candle data:', error.message);
    res.status(500).json({ error: 'Failed to fetch candle data' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});

// =IF(C2 > 6.5, "highly up", IF(C2 > 2.5, "up", IF(C2 > 0, "slightly up", IF(C2 > -2.5, "slightly down", IF(C2 > -6.5, "down", "highly down")))))
// On the basis of company details and news today which i have provided around the company can you tell if the stock price of the company will go
// range[highly up,up,slightly up,slightly down, down, highly up] please return answer in one word from the range
