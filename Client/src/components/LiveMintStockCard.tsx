import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { green, red, orange, grey } from '@mui/material/colors';

// Define the Trend Rating colors based on status
const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'Bullish':
      return green[500];
    case 'Bearish':
      return red[500];
    case 'Neutral':
      return grey[500];
    default:
      return orange[500];
  }
};

interface LiveMintStockCardProps {
  date: string;
  displayName: string;
  description: string;
  overallRating: string;
  longTermTrends: string;
  shortTermTrends: string;
}

const LiveMintStockCard: React.FC<LiveMintStockCardProps> = ({
  date,
  displayName,
  description,
  overallRating,
  longTermTrends,
  shortTermTrends,
}) => {
  return (
    <Card sx={{ maxWidth: 345, marginBottom: 2, backgroundColor: '#242424' }}>
      <CardContent sx={{ color: 'white' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip
            label={displayName}
            sx={{
              backgroundColor: '#1976D2', // Dark green chip for company name
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" mt={2}>
          Publish date:  {date}
          </Typography>
        <Typography variant="body2" paragraph sx={{ marginTop: 1 }}>
          {description}
        </Typography>

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Overall Rating:
            <span
              style={{
                color: getTrendColor(overallRating), // Color code based on the overall rating
                marginLeft: 5,
              }}
            >
              {overallRating}
            </span>
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', marginTop: 1 }}>
            Long Term Trend:
            <span
              style={{
                color: getTrendColor(longTermTrends), // Color code for long-term trends
                marginLeft: 5,
              }}
            >
              {longTermTrends}
            </span>
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', marginTop: 1 }}>
            Short Term Trend:
            <span
              style={{
                color: getTrendColor(shortTermTrends), // Color code for short-term trends
                marginLeft: 5,
              }}
            >
              {shortTermTrends}
            </span>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LiveMintStockCard;
