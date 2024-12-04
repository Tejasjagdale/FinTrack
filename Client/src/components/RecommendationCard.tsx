import React from "react";
import { Box, Chip, Typography } from "@mui/material";

interface RecommendationCardProps {
  companyName: string;
  newsImpact: string;
  impactReason: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  companyName,
  newsImpact,
  impactReason,
}) => {
  const isPositiveImpact = newsImpact.toLowerCase() === "positive";

  return (
    <Box
      sx={{
        backgroundColor: "#333333",
        color: "#ffffff",
        p: 3,
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* Company Name Chip */}
      <Chip
        label={companyName}
        sx={{
          alignSelf: "start",
          backgroundColor: "#2196f3",
          color: "#ffffff",
          fontWeight: "bold",
        }}
      />

      {/* News Impact Chip */}
      <Chip
        label={newsImpact}
        sx={{
          alignSelf: "center",
          backgroundColor: isPositiveImpact ? "#4caf50" : "#f44336",
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "1rem",
          px: 2,
        }}
      />

      {/* Impact Reason */}
      <Box
        sx={{
          backgroundColor: "white",
          p: 2,
          color:"#242424",
          borderRadius: 1,
          textAlign: "left",
          fontSize: "0.9rem",
        }}
      >
        <Typography variant="body1">{impactReason}</Typography>
      </Box>
    </Box>
  );
};

export default RecommendationCard;
