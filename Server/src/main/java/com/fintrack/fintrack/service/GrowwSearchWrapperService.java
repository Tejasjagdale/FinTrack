package com.fintrack.fintrack.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class GrowwSearchWrapperService {
    private final WebClient webClientGroww;

    public GrowwSearchWrapperService(WebClient webClientGroww) {
        this.webClientGroww = webClientGroww;
    }

    public JsonNode getSearchResults(String query) {
        try {
            // Making the API call with WebClient
            JsonNode response = webClientGroww.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1/api/search/v3/query/global/st_query")
                            .queryParam("entity_type", "stocks")
                            .queryParam("from", 0)
                            .queryParam("query", query)
                            .queryParam("size", 10)
                            .queryParam("web", true)
                            .build())
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            error -> Mono.error(new RuntimeException("Error calling Groww API!")))
                    .bodyToMono(JsonNode.class)  // Correctly parse the response as JsonNode
                    .block(); // Synchronous call, consider using reactive flow if needed

            // Safely accessing the nested fields
            if (response != null && response.has("data") && response.get("data").has("content")) {
                return response.get("data").get("content");
            } else {
                throw new RuntimeException("Invalid response structure from Groww API");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch data from Groww API: " + e.getMessage());
        }
    }
}
