package com.fintrack.fintrack.service;

import com.fintrack.fintrackmodel.DTO.NewsArticle;
import com.fintrack.fintrackmodel.DTO.StockResponseAll;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GrowwStockNewsService {

    private final WebClient webClientGroww;
    private final GrowwStockDetailService growwStockDetailService;  // Injected StockDetailService

    private static final int DEFAULT_TIME_WINDOW_HOURS = 24;

    /**
     * Fetches news articles for a given stock by company ID.
     *
     * @param growwCompanyId Company ID for fetching news.
     * @return List of News Articles.
     */
    public List<NewsArticle> fetchStockNews(String growwCompanyId) {
        String apiUrl = "/v1/api/groww-news/v2/stocks/news/" + growwCompanyId + "?page=0&size=50";

        try {
            // Fetch the news data from the Groww API
            Mono<Map> response = webClientGroww.get()
                    .uri(apiUrl)
                    .retrieve()
                    .bodyToMono(Map.class);

            Map<String, Object> responseData = response.block();
            List<Map<String, Object>> newsList = (List<Map<String, Object>>) responseData.get("results");

            if (newsList == null || newsList.isEmpty()) {
                return Collections.emptyList();
            }

            LocalDateTime currentTime = LocalDateTime.now(ZoneId.of("UTC"));
            LocalDateTime startTime = isMonday(currentTime)
                    ? currentTime.minusDays(3).withHour(0).withMinute(0).withSecond(0)
                    : currentTime.minusHours(DEFAULT_TIME_WINDOW_HOURS);

            // Filter news articles based on publication date
            return newsList.stream()
                    .map(news -> {
                        try {
                            LocalDateTime pubDate = LocalDateTime.parse((String) news.get("pubDate"));
                            if (pubDate.isAfter(startTime) && pubDate.isBefore(currentTime)) {
                                return new NewsArticle(
                                        (String) news.get("title"),
                                        (String) news.get("link"),
                                        (String) news.get("pubDate"),
                                        (String) news.get("description")
                                );
                            }
                        } catch (DateTimeParseException e) {
                            e.printStackTrace();
                        }
                        return null;
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            throw new RuntimeException("Error fetching news for company ID: " + growwCompanyId, e);
        }
    }

    /**
     * Fetches stock details and news, enriching the stock data.
     *
     * @param stocksData List of StockResponseAll objects.
     * @return List of StockResponseAll with attached news and details.
     */
    public List<StockResponseAll> enrichStocksWithNewsAndDetails(List<StockResponseAll> stocksData) {
        List<StockResponseAll> enrichedStocks = new ArrayList<>();

        for (StockResponseAll stock : stocksData) {
            if (stock.getSearchId() == null || stock.getSearchId().isEmpty()) {
                continue;  // Skip stocks with no valid search ID
            }

            try {
                // Fetch stock details and update the stock object
                StockResponseAll updatedStock = growwStockDetailService.fetchStockDetails(stock.getSearchId());
                stock.setFullName(updatedStock.getFullName());
                stock.setParentCompany(updatedStock.getParentCompany());
                stock.setHeadquarters(updatedStock.getHeadquarters());
                stock.setCeo(updatedStock.getCeo());
                stock.setManagingDirector(updatedStock.getManagingDirector());
                stock.setBusinessSummary(updatedStock.getBusinessSummary());
                stock.setWebsiteUrl(updatedStock.getWebsiteUrl());

                // Fetch and attach news articles
                List<NewsArticle> newsArticles = fetchStockNews(stock.getSearchId());
                stock.setLatestNews(newsArticles);

                enrichedStocks.add(stock);
            } catch (Exception e) {
                System.err.println("Error enriching stock data for: " + stock.getSearchId());
            }
        }
        return enrichedStocks;
    }

    /**
     * Checks if today is Monday.
     */
    private boolean isMonday(LocalDateTime dateTime) {
        return dateTime.getDayOfWeek().getValue() == 1;
    }
}
