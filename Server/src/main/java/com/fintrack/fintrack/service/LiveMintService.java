package com.fintrack.fintrack.service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;

@Service
public class LiveMintService {

    private final WebClient webClientLiveMint;
    private final ObjectMapper objectMapper;

    public LiveMintService(WebClient webClientLiveMint, ObjectMapper objectMapper) {
        this.webClientLiveMint = webClientLiveMint;
        this.objectMapper = objectMapper;
    }

    /**
     * Fetches data from LiveMint API, transforms it, and returns a merged and deduplicated list.
     */
    public JsonNode fetchAndTransformData() {
        try {
            JsonNode response = webClientLiveMint.get()
                    .uri("/lm-img/markets/prod/mintgeniemarketdashboardfeed.json")
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            error -> Mono.error(new RuntimeException("Error calling LiveMint API!")))
                    .bodyToMono(JsonNode.class)
                    .block();

            if (response == null || !response.has("data")) {
                throw new RuntimeException("Invalid response structure from LiveMint API");
            }

            // Initialize transformed data map
            Map<String, List<JsonNode>> transformedData = initializeTransformedDataMap();

            // Loop through the JSON data and process it
            for (JsonNode item : response.get("data")) {
                String node = item.has("node") ? item.get("node").asText() : "";
                switch (node) {
                    case "nse_top_gainer_losers" -> processNodeData(transformedData, item, "nse_top_gainer_losers", "topGainers", "topLooser");
                    case "top_gainer_losers" -> processNodeData(transformedData, item, "top_gainer_losers", "topGainers", "topLooser");
                    case "nse_market_vol_most_active" -> processNodeData(transformedData, item, "nse_market_vol_most_active");
                    case "market_vol_most_active" -> processNodeData(transformedData, item, "market_vol_most_active");
                    case "price_volume_shocker" -> processNodeData(transformedData, item, "price_volume_shocker", "BSE_PriceShocker", "NSE_PriceShocker");
                }
            }

            return mergeAndDeduplicate(transformedData);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching or transforming data: " + e.getMessage());
        }
    }

    /**
     * Initializes the transformed data map with empty lists.
     */
    private Map<String, List<JsonNode>> initializeTransformedDataMap() {
        Map<String, List<JsonNode>> transformedData = new HashMap<>();
        transformedData.put("nse_top_gainer_losers", new ArrayList<>());
        transformedData.put("top_gainer_losers", new ArrayList<>());
        transformedData.put("nse_market_vol_most_active", new ArrayList<>());
        transformedData.put("market_vol_most_active", new ArrayList<>());
        transformedData.put("price_volume_shocker", new ArrayList<>());
        return transformedData;
    }

    /**
     * Processes and extracts data for a given node.
     */
    private void processNodeData(Map<String, List<JsonNode>> transformedData, JsonNode item, String node, String... keys) {
        for (String key : keys) {
            transformedData.get(node).addAll(extractList(item, "data", key));
        }
    }

    /**
     * Extracts a list of items from a JSON node, handling missing keys gracefully.
     * FIXED: Proper handling of JsonNode arrays and single objects.
     */
    private List<JsonNode> extractList(JsonNode item, String... keys) {
        JsonNode currentNode = item;
        for (String key : keys) {
            currentNode = currentNode.path(key);
        }

        List<JsonNode> resultList = new ArrayList<>();
        if (currentNode.isArray()) {
            currentNode.forEach(resultList::add);
        } else if (!currentNode.isMissingNode()) {
            resultList.add(currentNode);
        }
        return resultList;
    }

    /**
     * Merges all arrays and removes duplicates based on the 'displayName' field.
     */
    private JsonNode mergeAndDeduplicate(Map<String, List<JsonNode>> transformedData) {
        List<JsonNode> allItems = new ArrayList<>();
        transformedData.values().forEach(allItems::addAll);

        Map<String, JsonNode> deduplicated = new LinkedHashMap<>();
        for (JsonNode item : allItems) {
            if (item != null && item.has("displayName")) {
                deduplicated.put(item.get("displayName").asText(), item);
            }
        }

        return objectMapper.valueToTree(Map.of("liveMintRecommendations", new ArrayList<>(deduplicated.values())));
    }
}