package com.fintrack.fintrackmodel.Entity.Stocks;

import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class StockDetailsPrimaryKey implements Serializable {

    private String nseScriptCode;
    private String companyName;
}
