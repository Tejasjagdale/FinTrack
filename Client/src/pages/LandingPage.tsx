import React, { useState } from 'react';
import axios from 'axios';
import { TextField, List, ListItem, ListItemText, Typography, Box, CircularProgress } from '@mui/material';
import CandleChart from '../components/StockChartModal';

const LandingPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('/api/v1/api/search/v3/query/stocks/st_query', {
        params: {
          from: 0,
          query: searchQuery,
          size: 10,
          web: true,
        },
      });
      setResults(response.data.data.content || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#242424',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: '#FFFFFF',
          marginBottom: '20px',
        }}
      >
        Stock Search
      </Typography>

      <TextField
        variant="outlined"
        placeholder="Search stocks..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        sx={{
          input: { color: '#FFFFFF' },
          label: { color: '#CCCCCC' },
          backgroundColor: '#333333',
          borderRadius: '5px',
          marginBottom: '20px',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#555555',
            },
            '&:hover fieldset': {
              borderColor: '#888888',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#AAAAAA',
            },
          },
        }}
      />

      {loading && <CircularProgress sx={{ color: '#FFFFFF', marginBottom: '20px' }} />}

      <List
        sx={{
          width: '100%',
          maxWidth: '600px',
          backgroundColor: '#333333',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
        }}
      >
        {results.map((item) => (
          <ListItem
            key={item.id}
            sx={{
              borderBottom: '1px solid #555555',
              '&:last-child': { borderBottom: 'none' },
            }}
          >
            <ListItemText
              primary={item.title}
              secondary={item.entity_type}
              primaryTypographyProps={{ color: '#FFFFFF', fontWeight: 'bold' }}
              secondaryTypographyProps={{ color: '#AAAAAA' }}
            />
          </ListItem>
        ))}
        {!loading && query && results.length === 0 && (
          <Typography
            variant="body2"
            sx={{
              color: '#AAAAAA',
              textAlign: 'center',
              padding: '10px',
            }}
          >
            No results found.
          </Typography>
        )}
      </List>
      <CandleChart/>
    </Box>
  );
};

export default LandingPage;

// nse-script code ADANIENSOL or bse_scrip_code 539254
// 
