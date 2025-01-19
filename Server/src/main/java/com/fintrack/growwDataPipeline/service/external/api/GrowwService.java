package com.fintrack.growwDataPipeline.service.external.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fintrack.fintrackmodel.Entity.Stocks.StockDetails;
import com.fintrack.fintrack.repository.StockDetailsRepository;
import com.fintrack.growwDataPipeline.DTO.GrowwAllStocksResponseDTO;
import com.fintrack.growwDataPipeline.DTO.GrowwFilterDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class GrowwService {

    private final WebClient webClientGroww;

    private final StockDetailsRepository stockDetailsRepository;

    // Inject the named WebClient bean
    public GrowwService(WebClient webClientGroww, StockDetailsRepository stockDetailsRepository) {
        this.webClientGroww = webClientGroww;
        this.stockDetailsRepository = stockDetailsRepository;
    }

    public class ApiResponse {
        private List<GrowwAllStocksResponseDTO> records;

        public List<GrowwAllStocksResponseDTO> getResponse() {
            return records;
        }

        // Getters and Setters
    }

    @Transactional
    public List<GrowwAllStocksResponseDTO> getAllStocks() {

        GrowwFilterDTO requestDto = new GrowwFilterDTO();

        String payload = """
        {
            "listFilters": {
                "INDUSTRY": [],
                "INDEX": []
            },
            "objFilters": {
                "CLOSE_PRICE": {
                    "max": 500000,
                    "min": 0
                },
                "MARKET_CAP": {
                    "min": 0,
                    "max": 300000000000000000
                }
            },
            "page": "4",
            "size": "1000",
            "sortBy": "NA",
            "sortType": "ASC"
        }
        """;

        try {
            System.out.println(requestDto);
            // Make the POST request using WebClient
            JsonNode response = webClientGroww.post()
                    .uri("/v1/api/stocks_data/v1/all_stocks")
                    .header("Content-Type", "application/json")
                    .bodyValue(payload)  // Set the request body
                    .retrieve() // Retrieve the response
                    .bodyToMono(JsonNode.class)  // Map the response to ApiResponse class
                    .block(); // Block to get the response synchronously

           JsonNode records = response.get("records");

            List<GrowwAllStocksResponseDTO> stocksList = new ArrayList<>();

            // Iterate through each record and map to the DTO
            for (JsonNode record : records) {
                GrowwAllStocksResponseDTO stockDTO = new GrowwAllStocksResponseDTO();
                stockDTO.setGrowwContractId(record.get("growwContractId").asText());
                stockDTO.setSearchId(record.get("searchId").asText());
                stockDTO.setNseScriptCode(record.get("nseScriptCode").asText());
                stockDTO.setBseScriptCode(record.get("bseScriptCode").asText());
                stockDTO.setCompanyName(record.get("companyName").asText());

                // Add the DTO to the list
                stocksList.add(stockDTO);
            }

            // Return the list of mapped DTOs
            for (GrowwAllStocksResponseDTO stockDTO : stocksList) {
                // Call the method to insert, ignoring duplicates
                StockDetails stockDetails = StockDetails.builder()
                        .bseScriptCode(stockDTO.getBseScriptCode())
                        .companyName(stockDTO.getCompanyName())
                        .nseScriptCode(stockDTO.getNseScriptCode())
                        .growwContractId(stockDTO.getGrowwContractId())
                        .growwSearchId(stockDTO.getSearchId())
                        .build();
                stockDetailsRepository.save(stockDetails);
            }

            // Save the list of StockDetails entities to the database
            return stocksList;
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
}


