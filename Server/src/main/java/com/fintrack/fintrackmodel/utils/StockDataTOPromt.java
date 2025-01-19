package com.fintrack.fintrackmodel.utils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class StockDataTOPromt {

    private static final String INSTRUCTION = """
            Analyze the provided news in relation to the company details and assess its impact on public sentiment 
            towards the company. Return the result in the following format: companyName: add company name here, 
            newsImpact: from the range provided, impactReason: Explain briefly why this impact was chosen, based on the news.
            """;

    /**
     * Formats the company details including name, CEO, and MD.
     *
     * @param companyData Map containing company data.
     * @return Formatted string with company details.
     */
    public static String formatCompanyDetails(Map<String, Object> companyData) {
        return String.format(
                "Company name is %s and the CEO is %s and MD is %s.",
                companyData.getOrDefault("fullName", "N/A"),
                companyData.getOrDefault("ceo", "N/A"),
                companyData.getOrDefault("managingDirector", "N/A")
        );
    }

    /**
     * Formats the business summary of the company.
     *
     * @param companyData Map containing company data.
     * @return Formatted business summary.
     */
    public static String formatBusinessSummary(Map<String, Object> companyData) {
        return "Business Summary: " + companyData.getOrDefault("businessSummary", "No summary available.");
    }

    /**
     * Formats news articles related to the company.
     *
     * @param newsData List containing news articles.
     * @return Formatted string containing news data.
     */
    public static String formatNews(List<Map<String, Object>> newsData) {
        if (newsData == null || newsData.isEmpty()) {
            return "No recent news available.";
        }

        return newsData.stream()
                .map(news -> String.format(
                        "News: Headline: %s \nSummary: %s",
                        news.getOrDefault("title", "No title available"),
                        news.getOrDefault("summary", "No summary available")
                ))
                .collect(Collectors.joining("\n\n"));
    }

    /**
     * Combines all formatted data for a given stock and prepares it for analysis.
     *
     * @param stocksData List containing stock data.
     * @return List of formatted strings for each stock with the analysis instruction.
     */
    public static List<String> dataToPrompt(List<Map<String, Object>> stocksData) {
        return stocksData.stream().map(companyData -> {
            try {
                String companyDetails = formatCompanyDetails(companyData);
                String businessSummary = formatBusinessSummary(companyData);
                List<Map<String, Object>> newsData = (List<Map<String, Object>>) companyData.getOrDefault("latestNews", List.of());
                String formattedNews = formatNews(newsData);

                // Combining all components into the final formatted output
                return companyDetails + "\n" +
                        businessSummary + "\n\n" +
                        formattedNews + "\n\n" +
                        INSTRUCTION;
            } catch (Exception e) {
                return "Error analyzing stock data: " + e.getMessage();
            }
        }).collect(Collectors.toList());
    }
}

