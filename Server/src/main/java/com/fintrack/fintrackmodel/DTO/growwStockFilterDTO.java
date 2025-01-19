package com.fintrack.fintrackmodel.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class growwStockFilterDTO {
    private List<String> industry;
    private List<String> index;
    private Filter closePrice;
    private Filter marketCap;
    private String page;
    private String size;
    private String sortBy;
    private String sortType;

    @Getter
    @Setter
    public static class Filter {
        private Long min;
        private Long max;
    }
}
