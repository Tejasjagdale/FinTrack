package com.fintrack.fintrack.controller;

import com.fintrack.fintrack.service.GrowwAllStocksService;
import com.fintrack.fintrack.service.GrowwSearchWrapperService;
import com.fintrack.fintrack.service.GrowwStockChartService;
import com.fintrack.fintrack.service.GrowwStockNewsPromts;
import com.fintrack.fintrackmodel.DTO.StockFiltersDTO;
import com.fintrack.fintrackmodel.DTO.StockResponseAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/v1/finTrack/groww")
public class GrowwApiController {

    @Autowired
    GrowwSearchWrapperService growwApiWrapperService;

    @Autowired
    GrowwAllStocksService growwAllStocksService;

    @Autowired
    GrowwStockChartService growwStockChartService;

    @Autowired
    GrowwStockNewsPromts growwStockNewsPromts;

   @GetMapping("/stock/search")
    public Object getStockData(@RequestParam String query) {
        return  growwApiWrapperService.getSearchResults(query);
    }

    @PostMapping("/stock/all")
    public ResponseEntity<List<StockResponseAll>> fetchStocks(@RequestBody StockFiltersDTO filters) {
        List<StockResponseAll> stocks =  growwAllStocksService.fetchAllStocks(filters); // Fixed method call
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/stock/chart")
    public ResponseEntity<Map<String, Object>> getStockChart(@RequestParam String stockName, @RequestParam String timeline) {

        Map<String, Object> result = growwStockChartService.fetchStockChart(stockName, timeline);
        return ResponseEntity.ok(result);
    }


    @PostMapping("/stock/all/news")
    public ResponseEntity<List<StockResponseAll>> fetchStocksNews(@RequestBody StockFiltersDTO filters) {
        List<StockResponseAll> stocks =  growwStockNewsPromts.getNewsSentiment(filters); // Fixed method call
        return ResponseEntity.ok(stocks);
    }
}
