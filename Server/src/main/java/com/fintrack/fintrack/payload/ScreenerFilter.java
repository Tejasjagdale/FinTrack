package com.fintrack.fintrack.payload;

import lombok.*;

@ToString
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScreenerFilter {

    private String companyId;
    private String query;

}
