import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import StockChartModal from "./StockChartModal";

interface News {
  id: string;
  title: string;
  summary: string;
  url: string;
  pubDate: string;
  source: string;
}

interface CompanyNews {
  companyName: string;
  latestNews: News[];
  nseScriptCode: string;
}

interface CompanyNewsCardProps {
  data: CompanyNews;
}

export const CompanyNewsCard: React.FC<CompanyNewsCardProps> = ({ data }) => {
  const { companyName, latestNews, nseScriptCode } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card sx={{ backgroundColor: "#2d2d2d", color: "#fff", mb: 2, position: "relative" }}>
      {/* Company Name Chip */}
      <StockChartModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        companyName={nseScriptCode}
      />
      <Box sx={{display:"flex",justifyContent:"flex-end"}}>
        <IconButton onClick={() => setIsModalOpen(true)} color="success" size="small">
          <ShowChartIcon />
        </IconButton>
      </Box>

      <Chip
        label={companyName}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          backgroundColor: "#1976d2",
          color: "#fff",
          fontWeight: "bold",
        }}
      />

      {/* News Content */}
      <CardContent sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>
          Latest News
        </Typography>
        <List>
          {latestNews.map((newsItem) => (
            <React.Fragment key={newsItem.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ color: "#90caf9", fontWeight: 500 }}>
                      {newsItem.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        sx={{ color: "#b0bec5", display: "inline", fontStyle: "italic" }}
                      >
                        {newsItem.source} • {new Date(newsItem.pubDate).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#eceff1", mt: 0.5 }}>
                        {newsItem.summary}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider sx={{ backgroundColor: "#424242" }} />
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};