package com.fintrack.fintrack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.http.codec.ClientCodecConfigurer;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.http.HttpClient;
import java.time.Duration;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024));
    }

    @Bean(name = "webClientGroww")
    public WebClient webClientGroww(WebClient.Builder webClientBuilder) {
        return webClientBuilder.baseUrl("https://groww.in").build();
    }

    @Bean(name = "webClientLiveMint")
    public WebClient webClientLiveMint(WebClient.Builder webClientBuilder) {
        return webClientBuilder.baseUrl("https://www.livemint.com").build();
    }
}
