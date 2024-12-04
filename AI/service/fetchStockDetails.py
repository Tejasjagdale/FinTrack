import requests
from typing import List, Dict, Any

def fetch_stock_details(search_id: str) -> Dict[str, Any]:
    """
    Fetches additional details for a stock by its search ID.
    """
    try:
        # Define the API URL with the search ID
        api_url = f"https://groww.in/v1/api/stocks_data/v1/company/search_id/{search_id}"
        
        # Make a synchronous GET request
        response = requests.get(api_url)
        response.raise_for_status()

        # Parse the JSON response
        data = response.json()
        details = data.get("details", {})

        # Extract and return the relevant details
        return {
            "fullName": details.get("fullName"),
            "parentCompany": details.get("parentCompany"),
            "headquarters": details.get("headquarters"),
            "ceo": details.get("ceo"),
            "managingDirector": details.get("managingDirector"),
            "businessSummary": details.get("businessSummary"),
            "websiteUrl": details.get("websiteUrl"),
        }
    except requests.RequestException as e:
        print(f"Error fetching details for {search_id}: {e}")
        return {}

def attach_details_to_stocks(stocks_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Attaches additional details to each stock in the provided stock data.
    """
    stocks_with_details = []

    for stock in stocks_data:
        search_id = stock.get("searchId")
        if not search_id:
            continue

        # Fetch additional details and attach to the stock
        stock_details = fetch_stock_details(search_id)
        stock.update(stock_details)  # Merge details into the stock dictionary
        stocks_with_details.append(stock)

    return stocks_with_details
