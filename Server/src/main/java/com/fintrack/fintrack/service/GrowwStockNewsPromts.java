package com.fintrack.fintrack.service;

import com.fintrack.fintrackmodel.DTO.StockFiltersDTO;
import com.fintrack.fintrackmodel.DTO.StockResponseAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GrowwStockNewsPromts {

    @Autowired
    GrowwAllStocksService growwAllStocksService;

    @Autowired
    GrowwStockNewsService growwStockNewsService;

    @Autowired
    GrowwStockDetailService growwStockDetailService;

    public List<StockResponseAll> getNewsSentiment(StockFiltersDTO filters){
        List<StockResponseAll> stockData = growwAllStocksService.fetchAllStocks(filters);
        List<StockResponseAll> stockDataWithDetails =  growwStockDetailService.attachDetailsToStocks(stockData);
        List<StockResponseAll> stockDataWithNews = growwStockNewsService.enrichStocksWithNewsAndDetails(stockDataWithDetails);

        return stockDataWithNews;
    }
}
