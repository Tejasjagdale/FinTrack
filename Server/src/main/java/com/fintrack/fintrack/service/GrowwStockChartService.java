package com.fintrack.fintrack.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GrowwStockChartService {

    private final WebClient webClientGroww;  // Reusing the configured WebClient
    private final ObjectMapper objectMapper;

    // Timeline endpoints mapping
    private static final Map<String, String> TIMELINE_ENDPOINTS = Map.of(
            "weekly", "weekly?intervalInMinutes=5&minimal=true",
            "monthly", "monthly?intervalInMinutes=30&minimal=true",
            "3months", "monthly/v2?months=3&minimal=true",
            "6months", "monthly/v2?months=6&minimal=true",
            "1year", "1y?intervalInDays=1&minimal=true",
            "3years", "3y?intervalInDays=3&minimal=true",
            "5years", "5y?intervalInDays=5&minimal=true",
            "all", "all?noOfCandles=300"
    );

    private static final String BASE_URL_PATH = "/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH";

    /**
     * Fetches stock chart data for a specific stock and timeline.
     *
     * @param stockName The name of the stock.
     * @param timeline  The timeline key for fetching data.
     * @return A map containing candles, changeValue, and changePerc.
     */
    public Map<String, Object> fetchStockChart(String stockName, String timeline) {
        if (!TIMELINE_ENDPOINTS.containsKey(timeline)) {
            throw new IllegalArgumentException("Invalid timeline. Choose from: " + TIMELINE_ENDPOINTS.keySet());
        }

        // Build the API URL
        String apiPath = BASE_URL_PATH + "/" + stockName + "/" + TIMELINE_ENDPOINTS.get(timeline);

        try {
            // Fetch data from Groww API
            JsonNode response = webClientGroww.get()
                    .uri(apiPath)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block(); // Blocking for simplicity, consider reactive programming for production systems

            if (response == null || !response.has("candles")) {
                throw new RuntimeException("No candle data found for stock: " + stockName);
            }

            List<List<Object>> candles = objectMapper.convertValue(response.get("candles"), List.class);

            if (candles.isEmpty()) {
                throw new RuntimeException("No candles found in the API response.");
            }

            // Calculate changeValue and changePerc
            double firstPrice = ((Number) candles.get(0).get(1)).doubleValue();
            double lastPrice = ((Number) candles.get(candles.size() - 1).get(1)).doubleValue();
            double changeValue = lastPrice - firstPrice;
            double changePerc = firstPrice != 0 ? (changeValue / firstPrice) * 100 : 0;

            // Prepare the result map
            Map<String, Object> result = new HashMap<>();
            result.put("candles", candles);
            result.put("changeValue", Math.round(changeValue * 100.0) / 100.0);
            result.put("changePerc", Math.round(changePerc * 1000000.0) / 1000000.0);

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Error fetching stock chart data for: " + stockName, e);
        }
    }
}

