//package com.fintrack.fintrack.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//import java.util.List;
//
////@Configuration
////@EnableWebSecurity
////@EnableMethodSecurity
//public class SecurityConfig {
//    @Value("${frontend-url}")
//    private String frontendUrl;
//
//    @Autowired
//    private CustomSucessHandler customSucessHandler;
//
//    @Autowired
//    private CorsConfig corsConfig;
//
////    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        return http
//                .csrf(AbstractHttpConfigurer::disable)
////                .cors(cors -> cors.configurationSource(corsConfigurationSource()))  // Enable CORS with custom configuration
//                .authorizeHttpRequests(auth -> {
//                    auth.anyRequest().authenticated();
//                })
//                .oauth2Login(oauth2 -> {
//                    oauth2.defaultSuccessUrl("http://localhost:5173/user-details", true);
//                })
//                .build();
//    }
//
////    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.addAllowedOrigin("http://localhost:5173");  // Allow your frontend's URL
//        configuration.addAllowedMethod("GET");
//        configuration.addAllowedMethod("POST");
//        configuration.addAllowedMethod("PUT");
//        configuration.addAllowedMethod("DELETE");
//        configuration.addAllowedHeader("*");  // Allow any header
//        configuration.setAllowCredentials(true);  // Allow credentials (cookies, authorization headers)
//
//        // You can add more origins if needed
//        // configuration.addAllowedOrigin("http://other-origin.com");
//
//        // Apply configuration to all endpoints
//        CorsConfigurationSource source = request -> configuration;
//        return source;
//    }
//
//
//}
