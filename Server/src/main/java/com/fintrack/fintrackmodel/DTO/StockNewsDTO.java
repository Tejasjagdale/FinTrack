package com.fintrack.fintrackmodel.DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockNewsDTO {
    private String growwCompanyId;
    private String growwContractId;
    private String companyName;
    private List<NewsArticle> latestNews;
}

