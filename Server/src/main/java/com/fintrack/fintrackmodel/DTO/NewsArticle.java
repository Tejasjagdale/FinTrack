package com.fintrack.fintrackmodel.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewsArticle {
    private String title;
    private String link;
    private String pubDate;
    private String description;
}

