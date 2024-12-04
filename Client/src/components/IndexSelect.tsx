import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface StockFilterProps {
    filters: { index: string[] };
    onChange: (field: string, value: any) => void;
}

const indices = {
    "Nifty Bank": "Nifty Bank",
    "Nifty Next 50": "Nifty Next 50",
    "Nifty Midcap 100": "Nifty Midcap 100",
    SENSEX: "SENSEX",
    "Nifty 50": "Nifty 50",
    "Nifty 100": "Nifty 100",
    "BSE 100": "BSE 100",
};

const IndexSelect: React.FC<StockFilterProps> = ({ filters, onChange }) => {
    return (
        <FormControl fullWidth>
            <InputLabel sx={{ color: "#ffffff" }}>Index</InputLabel>
            <Select
                multiple
                value={filters.index}
                onChange={(e) => onChange("index", e.target.value)}
                sx={{
                    color: "#ffffff",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555555" },
                }}
                renderValue={(selected) => (selected as string[]).join(", ")}
            >
                {Object.entries(indices).map(([key, label]) => (
                    <MenuItem key={key} value={label} sx={{
                        backgroundColor: "#333333",
                        color: "#ffffff",
                    }}>
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default IndexSelect;
