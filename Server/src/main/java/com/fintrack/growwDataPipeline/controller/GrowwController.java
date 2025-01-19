package com.fintrack.growwDataPipeline.controller;

import com.fintrack.growwDataPipeline.service.external.api.GrowwService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/groww")
public class GrowwController {

    private final GrowwService growwService;

    public GrowwController(GrowwService growwService) {
        this.growwService = growwService;
    }

    @GetMapping("/stocks")
    public Object getAllStocks() {
        return growwService.getAllStocks();
    }
}