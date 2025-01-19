package com.fintrack.fintrack.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fintrack.fintrack.service.LiveMintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/finTrack")
public class ExternalRecommendationController {

    @Autowired
    LiveMintService liveMintService;

    @GetMapping("/api/livemint/stocks")
    public ResponseEntity<JsonNode> getLiveMintStocks() {
        JsonNode result = liveMintService.fetchAndTransformData();
        return ResponseEntity.ok(result);
    }
}
