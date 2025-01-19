package com.fintrack.fintrackmodel.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class StockDTO {
    private String growwContractId;
    private String growwSearchId;
    private String nseScriptCode;
    private String bseScriptCode;
    private String companyName;
}