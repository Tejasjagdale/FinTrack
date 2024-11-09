package com.fintrack.fintrack.external.api;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ScreenerService {

    private final RestTemplate restTemplate;

    public ScreenerService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Object getApiData(String companyId,String query,String days) {
//        Price-DMA50-DMA200-Volume&days=30
//        "100068"
        String url = "https://www.screener.in/api/company/"+companyId+"/chart/?q="+query+"&days="+days+"&consolidated=true";
        return restTemplate.getForObject(url, Object.class);
    }

}
