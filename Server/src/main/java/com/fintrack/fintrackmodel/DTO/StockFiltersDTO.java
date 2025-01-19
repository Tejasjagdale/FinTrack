package com.fintrack.fintrackmodel.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockFiltersDTO {
    private int numStocks;
    private List<String> industry;
    private List<String> index;
    private MarketCap marketCap = new MarketCap(0, 5000000);
}

