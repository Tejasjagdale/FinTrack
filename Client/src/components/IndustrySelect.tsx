import React from "react";
import { FormControl, InputLabel, Select, MenuItem, ListSubheader } from "@mui/material";

interface StockFilterProps {
    filters: { industry: string[] };
    onChange: (field: string, value: any) => void;
}

const sectors = [
    {
        sector: "Agricultural",
        industries: {
            "2": "Pesticides & Agrochemicals",
            "9": "Aquaculture",
            "47": "Fertilizers",
            "55": "Floriculture",
            "114": "Agriculture",
        },
    },
    {
        sector: "Apparel & Accessories",
        industries: {
            "35": "Diamond & Jewellery",
            "108": "Watches & Accessories",
            "158": "Footwear",
        },
    },
    {
        sector: "Automobile & Ancillaries",
        industries: {
            "10": "Auto Ancillary",
            "11": "Automobile Two & Three Wheelers",
            "12": "Automobiles - Passenger Cars",
            "13": "Automobiles-Tractors",
            "14": "Automobiles-Trucks/Lcv",
            "18": "Bearings",
            "107": "Tyres & Allied",
            "151": "Automobiles - Dealers & Distributors",
            "152": "Cycles",
        },
    },
    {
        sector: "Banking",
        industries: {
            "15": "Bank - Private",
            "16": "Bank - Public",
        },
    },
    // Add other sectors here...
];

const IndustrySelect: React.FC<StockFilterProps> = ({ filters, onChange }) => {
    return (
        <FormControl fullWidth>
            <InputLabel sx={{ color: "#ffffff" }}>Industry</InputLabel>
            <Select
                multiple
                value={filters.industry}
                onChange={(e) => onChange("industry", e.target.value)}
                sx={{
                    color: "#ffffff",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555555" },
                }}
                renderValue={(selected) => (selected as string[]).join(", ")}
            >
                {sectors.map((sector) => (
                    <React.Fragment key={sector.sector}>
                        <ListSubheader
                            sx={{
                                backgroundColor: "#333333",
                                color: "#ffffff",
                                fontWeight: "bold",
                            }}
                        >
                            {sector.sector}
                        </ListSubheader>
                        {Object.entries(sector.industries).map(([key, industry]) => (
                            <MenuItem key={key} value={industry} sx={{
                                backgroundColor: "#333333",
                                color: "#ffffff",
                            }}>
                                {industry}
                            </MenuItem>
                        ))}
                    </React.Fragment>
                ))}
            </Select>
        </FormControl>
    );
};

export default IndustrySelect;
