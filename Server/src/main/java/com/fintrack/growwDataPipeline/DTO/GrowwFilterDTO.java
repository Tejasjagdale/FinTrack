package com.fintrack.growwDataPipeline.DTO;
import java.util.List;

import lombok.*;

import java.util.Collections;

@Data
@NoArgsConstructor
@Setter
@Getter
public class GrowwFilterDTO {
    private ListFilters listFilters = new ListFilters();
    private ObjFilters objFilters = new ObjFilters();
    private String page = "0";
    private String size = "4000";
    private String sortBy = "NA";
    private String sortType = "ASC";

    @Data
    @NoArgsConstructor
    public static class ListFilters {
        private List<String> INDUSTRY = Collections.emptyList(); // Default to an empty list
        private List<String> INDEX = Collections.emptyList();
    }

    @Data
    @NoArgsConstructor
    public static class ObjFilters {
        private Filter CLOSE_PRICE = new Filter(0, 500000);
        private Filter MARKET_CAP = new Filter(0, 30000000000000000L);
    }

    @Data
    @AllArgsConstructor
    public static class Filter {
        private long min;
        private long max;

        public Filter(int i, long l) {
        }
    }
}


