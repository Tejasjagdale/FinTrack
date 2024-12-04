def format_company_details(company_data) -> str:
    """
    Format the company details including name, CEO, and MD.
    """
    return (
        f"Company name is {company_data.get('fullName')} and the CEO is {company_data.get('ceo')} "
        f"and MD is {company_data.get('managingDirector')}."
    )


def format_business_summary(company_data) -> str:
    """
    Format the business summary of the company.
    """
    return f"Business Summary: {company_data.get('businessSummary')}"


def format_news(news_data) -> str:
    """
    Format the news related to the company.
    """
    formatted_news = []
    for news in news_data:
        formatted_news.append(
            f"News: Headline: {news['title']} \nSummary: {news['summary']}"
        )
    return "\n\n".join(formatted_news)


def data_to_promt(stocks_data) -> list:
    """
    Analyzes multiple stocks and returns an array of formatted strings with stock predictions.
    """
    results = []
    instruction = """Analyze the provided news in relation to the company details and assess its impact on public sentiment 
        towards the company. Return the result in the following format: companyName: add company name here, 
        newsImpact: from the range provided , impactReason: Explain briefly why this impact was chosen, based on the news."""

    for company_data in stocks_data:
        try:
            # Format the company details and business summary
            company_details = format_company_details(company_data)
            business_summary = format_business_summary(company_data)

            # Gather and format news information
            news_data = company_data.get("latestNews", [])
            formatted_news = format_news(news_data)

            # Combine everything into a formatted output
            formatted_output = f"{company_details}\n{business_summary}\n\n{formatted_news}\n"

            # Append the final result with instructions for analysis
            results.append(formatted_output + f"{instruction}")

        except Exception as e:
            results.append(f"Error analyzing stock data: {e}")

    return results
