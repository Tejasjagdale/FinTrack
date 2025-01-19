package com.fintrack.fintrack.controller;

import com.fintrack.fintrack.external.api.ScreenerService;
import com.fintrack.fintrack.payload.ScreenerFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/finTrack")
public class ExternalApiController {

    @Autowired
    ScreenerService screenerService;

    @GetMapping("/stockdata")
    public Object getStockData(@RequestParam String companyId, @RequestParam String query,@RequestParam String days) {
        return screenerService.getApiData(companyId, query,days);
    }
}
