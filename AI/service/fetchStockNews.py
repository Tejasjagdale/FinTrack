import requests
import logging
from datetime import datetime, timedelta
import pytz

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants for API
NEWS_API_URL = "https://groww.in/v1/api/groww-news/v2/stocks/news"
DEFAULT_TIME_WINDOW_HOURS = 24

def fetch_stock_news(groww_company_id, time_window_hours=DEFAULT_TIME_WINDOW_HOURS):
    """
    Fetches and filters news for a stock by Groww Company ID within the given time window.
    """
    try:
        # Define the API URL
        api_url = f"{NEWS_API_URL}/{groww_company_id}?page=0&size=50"
        logger.info(f"Fetching news for company ID: {groww_company_id}")

        response = requests.get(api_url)
        response.raise_for_status()  # Raise exception for HTTP errors

        # Parse the JSON response
        data = response.json()
        news = data.get("results", [])
        if not news:
            logger.warning(f"No news found for company ID: {groww_company_id}")
            return []

        # Define the time range (last 'time_window_hours' hours)
        current_time = datetime.now(pytz.utc)
        start_time = current_time - timedelta(hours=time_window_hours)

        # Filter news based on publication time
        filtered_news = []
        for article in news:
            pub_date = article.get("pubDate")
            if not pub_date:
                continue
            try:
                pub_datetime = datetime.fromisoformat(pub_date).replace(tzinfo=pytz.utc)
                if start_time <= pub_datetime <= current_time:
                    filtered_news.append(article)
            except ValueError:
                logger.warning(f"Invalid date format for article: {article}")

        logger.info(f"Found {len(filtered_news)} news articles for company ID: {groww_company_id}")
        return filtered_news

    except requests.exceptions.RequestException as e:
        logger.error(f"Request error fetching news for {groww_company_id}: {e}")
        return []

    except Exception as e:
        logger.error(f"Unexpected error fetching news for {groww_company_id}: {e}")
        return []


def attach_news_to_stocks(stocks_data):
    """
    Attaches the latest news to each stock in the Nifty 100 data and retains only those stocks with at least one news article.
    """
    stocks_with_news = []
    skipped_stocks = []

    for stock in stocks_data:
        groww_company_id = stock.get("growwCompanyId") or stock.get("growwContractId")
        if not groww_company_id:
            skipped_stocks.append(stock.get("companyName", "Unknown"))
            continue  # Skip stocks without a valid company ID

        try:
            # Fetch and attach news to the stock
            stock_news = fetch_stock_news(groww_company_id)
            if stock_news:  # Include only if there is at least one news article
                stock["latestNews"] = stock_news
                stocks_with_news.append(stock)
            else:
                logger.info(f"No news for {stock.get('companyName', 'Unknown')}")

        except Exception as e:
            logger.error(f"Error attaching news to stock {stock.get('companyName', 'Unknown')}: {e}")

    logger.info(f"Processed {len(stocks_with_news)} stocks with news out of {len(stocks_data)}")
    if skipped_stocks:
        logger.warning(f"Skipped {len(skipped_stocks)} stocks due to missing IDs: {skipped_stocks}")

    return stocks_with_news
