package com.fintrack.fintrack.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintrack.fintrackmodel.DTO.StockResponseAll;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GrowwStockDetailService {

    private final WebClient webClientGroww;  // WebClient configured externally for reusability
    private final ObjectMapper objectMapper;

    /**
     * Fetches additional stock details using the searchId and maps them back to a StockResponseAll object.
     *
     * @param searchId The unique search identifier for the stock.
     * @return Updated StockResponseAll object with additional details.
     */
    public StockResponseAll fetchStockDetails(String searchId) {
        try {
            String apiPath = "/v1/api/stocks_data/v1/company/search_id/" + searchId;

            JsonNode response = webClientGroww.get()
                    .uri(apiPath)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block(); // Blocking call for simplicity

            if (response != null && response.has("details")) {
                JsonNode detailsNode = response.get("details");

                // Create a new StockResponseAll object from the existing searchId
                return StockResponseAll.builder()
                        .growwContractId(searchId)
                        .fullName(detailsNode.has("fullName") ? detailsNode.get("fullName").asText() : null)
                        .parentCompany(detailsNode.has("parentCompany") ? detailsNode.get("parentCompany").asText() : null)
                        .headquarters(detailsNode.has("headquarters") ? detailsNode.get("headquarters").asText() : null)
                        .ceo(detailsNode.has("ceo") ? detailsNode.get("ceo").asText() : null)
                        .managingDirector(detailsNode.has("managingDirector") ? detailsNode.get("managingDirector").asText() : null)
                        .businessSummary(detailsNode.has("businessSummary") ? detailsNode.get("businessSummary").asText() : null)
                        .websiteUrl(detailsNode.has("websiteUrl") ? detailsNode.get("websiteUrl").asText() : null)
                        .build();
            } else {
                throw new RuntimeException("No details found for searchId: " + searchId);
            }

        } catch (Exception e) {
            throw new RuntimeException("Error fetching details for searchId: " + searchId, e);
        }
    }

    /**
     * Attaches additional details to each stock in the provided list.
     *
     * @param stocksData List of StockResponseAll objects.
     * @return List of updated StockResponseAll objects with attached details.
     */
    public List<StockResponseAll> attachDetailsToStocks(List<StockResponseAll> stocksData) {
        List<StockResponseAll> stocksWithDetails = new ArrayList<>();

        for (StockResponseAll stock : stocksData) {
            if (stock.getSearchId() == null || stock.getSearchId().isEmpty()) {
                continue;  // Skip if searchId is missing
            }

            try {
                // Fetch and attach stock details
                StockResponseAll updatedStock = fetchStockDetails(stock.getSearchId());

                // Merging the details back to the stock object
                stock.setFullName(updatedStock.getFullName());
                stock.setParentCompany(updatedStock.getParentCompany());
                stock.setHeadquarters(updatedStock.getHeadquarters());
                stock.setCeo(updatedStock.getCeo());
                stock.setManagingDirector(updatedStock.getManagingDirector());
                stock.setBusinessSummary(updatedStock.getBusinessSummary());
                stock.setWebsiteUrl(updatedStock.getWebsiteUrl());

                stocksWithDetails.add(stock);
            } catch (Exception e) {
                System.err.println("Error fetching details for stock: " + stock.getSearchId());
            }
        }
        return stocksWithDetails;
    }
}
