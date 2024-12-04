package com.fintrack.fintrack.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${frontend-url}")
    private String frontendUrl;

    @Bean
    public WebMvcConfigurer corsConfiguration() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")  // Front-end URL
                        .allowedMethods("GET", "POST", "PUT", "DELETE")  // Allowed HTTP methods
                        .allowedHeaders("*")  // Allows any headers
                        .allowCredentials(true);  // Allows credentials (cookies, authorization headers)
            }
        };
    }
}
