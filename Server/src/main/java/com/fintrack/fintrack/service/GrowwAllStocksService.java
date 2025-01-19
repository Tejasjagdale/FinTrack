package com.fintrack.fintrack.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fintrack.fintrackmodel.DTO.StockFiltersDTO;
import com.fintrack.fintrackmodel.DTO.StockResponseAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GrowwAllStocksService {

    private final WebClient webClientGroww;
    private final ObjectMapper objectMapper;

    /**
     * Fetches stocks based on the provided filters and returns a list of StockResponse objects.
     */
    public List<StockResponseAll> fetchAllStocks(StockFiltersDTO stockFilters) {
        try {
            // Build the payload
            JsonNode payload = buildPayload(stockFilters);

            // Make the API call
            JsonNode response = webClientGroww.post()
                    .uri("/v1/api/stocks_data/v1/all_stocks")
                    .bodyValue(payload)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), error -> Mono.error(new RuntimeException("API returned an error.")))
                    .bodyToMono(JsonNode.class)
                    .block();

            // Validate and parse the response
            if (response != null && response.has("records")) {
                return parseResponse(response);
            } else {
                throw new RuntimeException("Invalid response structure from Groww API.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching stocks: " + e.getMessage());
        }
    }

    /**
     * Builds the request payload to match the expected API structure.
     */
    private JsonNode buildPayload(StockFiltersDTO stockFilters) {
        // Create the root payload object
        ObjectNode payload = objectMapper.createObjectNode();

        // Create listFilters and objFilters nodes
        ObjectNode listFilters = objectMapper.createObjectNode();
        ObjectNode objFilters = objectMapper.createObjectNode();
        ObjectNode closePrice = objectMapper.createObjectNode();
        ObjectNode marketCap = objectMapper.createObjectNode();

        // Properly handle INDUSTRY and INDEX arrays
        ArrayNode industryArray = listFilters.putArray("INDUSTRY");
        ArrayNode indexArray = listFilters.putArray("INDEX");

        // Adding INDUSTRY elements
        if (stockFilters.getIndustry() != null) {
            stockFilters.getIndustry().forEach(industryArray::add);
        }

        // Adding INDEX elements
        if (stockFilters.getIndex() != null) {
            stockFilters.getIndex().forEach(indexArray::add);
        }

        // Adding CLOSE_PRICE filters
        closePrice.put("min", 0);
        closePrice.put("max", 500000);

        // Adding MARKET_CAP filters with null checks
        marketCap.put("min", stockFilters.getMarketCap() != null ? stockFilters.getMarketCap().getMin() : 0);
        marketCap.put("max", stockFilters.getMarketCap() != null ? stockFilters.getMarketCap().getMax() : 3000000000000000000L);

        // Attach the nested nodes
        objFilters.set("CLOSE_PRICE", closePrice);
        objFilters.set("MARKET_CAP", marketCap);

        // Build the final payload structure
        payload.set("listFilters", listFilters);
        payload.set("objFilters", objFilters);
        payload.put("page", "0");
        payload.put("size", String.valueOf(stockFilters.getNumStocks() != 0 ? stockFilters.getNumStocks() : 150));
        payload.put("sortBy", "NA");
        payload.put("sortType", "ASC");

        return payload;
    }


    /**
     * Parses the API response and returns a list of StockResponseAll objects.
     */
    private List<StockResponseAll> parseResponse(JsonNode response) {
        List<StockResponseAll> stockList = new ArrayList<>();
        JsonNode records = response.get("records");

        if (records != null && records.isArray()) {
            records.forEach(record -> {
                StockResponseAll stock = new StockResponseAll(
                        record.has("growwContractId") ? record.get("growwContractId").asText() : null,
                        record.has("companyName") ? record.get("companyName").asText() : null,
                        record.has("companyShortName") ? record.get("companyShortName").asText() : null,
                        record.has("searchId") ? record.get("searchId").asText() : null,
                        record.has("nseScriptCode") ? record.get("nseScriptCode").asText() : null,
                        record.has("bseScriptCode") ? record.get("bseScriptCode").asText() : null
                );
                stockList.add(stock);
            });
        }
        return stockList;
    }

}
