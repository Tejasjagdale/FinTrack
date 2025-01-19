package com.fintrack.growwDataPipeline.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class GrowwAllStocksResponseDTO {
    private String growwContractId;
    private String searchId; // Rename to 'growwSearchId' if needed
    private String nseScriptCode;
    private String bseScriptCode;
    private String companyName;
}
