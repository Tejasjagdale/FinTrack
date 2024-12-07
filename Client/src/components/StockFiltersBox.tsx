import React from "react";
import { Box, TextField } from "@mui/material";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dayjs } from "dayjs";
import IndustrySelect from "./IndustrySelect";
import IndexSelect from "./IndexSelect";

interface MarketCap {
  min: number;
  max: number;
}

interface StockFilters {
  num_stocks: number;
  industry: string[];
  index: string[];
  market_cap: MarketCap;
  fromDate: Dayjs;
  toDate: Dayjs;
}

interface StockFilterProps {
  filters: StockFilters;
  onChange: (field: keyof StockFilters, value: any) => void;
}

const StockFilter: React.FC<StockFilterProps> = ({ filters, onChange }) => {
  const datePickerStyles = {
    backgroundColor: "#333333",
    color: "#ffffff",
    border: "1px solid #555555",
    borderRadius: "5px",
    padding: "8px",
    width: "100%",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 600,
        width: "100%",
        backgroundColor: "#333333",
        p: 3,
        borderRadius: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <TextField
        label="Number of Stocks"
        type="number"
        value={filters.num_stocks}
        onChange={(e) => onChange("num_stocks", parseInt(e.target.value, 10))}
        fullWidth
        InputLabelProps={{ style: { color: "#ffffff" } }}
        inputProps={{ style: { color: "#ffffff" } }}
        sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555555" } } }}
      />

      <IndustrySelect filters={filters} onChange={onChange} />
      <IndexSelect filters={filters} onChange={onChange} />

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Market Cap Min"
          type="number"
          value={filters.market_cap.min}
          onChange={(e) =>
            onChange("market_cap", {
              ...filters.market_cap,
              min: parseInt(e.target.value, 10),
            })
          }
          fullWidth
          InputLabelProps={{ style: { color: "#ffffff" } }}
          inputProps={{ style: { color: "#ffffff" } }}
          sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555555" } } }}
        />
        <TextField
          label="Market Cap Max"
          type="number"
          value={filters.market_cap.max}
          onChange={(e) =>
            onChange("market_cap", {
              ...filters.market_cap,
              max: parseInt(e.target.value, 10),
            })
          }
          fullWidth
          InputLabelProps={{ style: { color: "#ffffff" } }}
          inputProps={{ style: { color: "#ffffff" } }}
          sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555555" } } }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <label style={{ color: "#ffffff" }}>From Date</label>
        <ReactDatePicker
          selected={filters.fromDate}
          onChange={(date) => onChange("fromDate", date)}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          customInput={<input style={datePickerStyles} />}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <label style={{ color: "#ffffff" }}>To Date</label>
        <ReactDatePicker
          selected={filters.toDate}
          onChange={(date) => onChange("toDate", date)}
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
          customInput={<input style={datePickerStyles} />}
        />
      </Box>
    </Box>
  );
};

export default StockFilter;
