package com.fintrack.fintrackmodel.DTO;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class StockResponseAll {
    private String searchId;
    private String growwContractId;
    private String fullName;
    private String parentCompany;
    private String companyName;
    private String companyShortName;
    private String nseScriptCode;
    private String bseScriptCode;
    private String headquarters;
    private String ceo;
    private String managingDirector;
    private String businessSummary;
    private String websiteUrl;
    private List<NewsArticle> latestNews;

    public StockResponseAll(String growwContractId, String companyName, String companyShortName,
                            String searchId, String nseScriptCode, String bseScriptCode) {
        this.growwContractId = growwContractId;
        this.companyName = companyName;
        this.companyShortName = companyShortName;
        this.searchId = searchId;
        this.nseScriptCode = nseScriptCode;
        this.bseScriptCode = bseScriptCode;
    }
}
