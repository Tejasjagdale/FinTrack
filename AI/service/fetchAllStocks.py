from ast import List
from pydantic import BaseModel
import requests
import logging

from service.fetchStockDetails import attach_details_to_stocks
from service.fetchStockNews import attach_news_to_stocks

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MarketCap(BaseModel):
    min: int
    max: int

class StockFilters(BaseModel):
    num_stocks: int
    industry: List[str]
    index: List[str]
    market_cap: MarketCap

class StockFetcher:
    BASE_URL = "https://groww.in/v1/api/stocks_data/v1/all_stocks"
    HEADERS = {"Content-Type": "application/json"}

    @staticmethod
    def build_payload(stock_filters: StockFilters) -> dict:
        """
        Build the request payload based on the provided stock filters.
        """
        logger.info(f"Building payload with filters: {stock_filters}")
        return {
            "listFilters": {
                "INDUSTRY": stock_filters.industry,
                "INDEX": stock_filters.index,
            },
            "objFilters": {
                "CLOSE_PRICE": {
                    "max": 5000000,
                    "min": 0,
                },
                "MARKET_CAP": {
                    "min": stock_filters.market_cap.min,
                    "max": stock_filters.market_cap.max,
                },
            },
            "page": "0",
            "size": stock_filters.num_stocks,
            "sortBy": "NA",
            "sortType": "ASC",
        }

    @staticmethod
    async def fetch_all_stocks(stock_filters: StockFilters) -> List[dict]:
        """
        Fetch stocks from the Groww API based on the given filters.
        """
        payload = StockFetcher.build_payload(stock_filters)

        try:
            logger.info(f"Making API call to {StockFetcher.BASE_URL} with payload: {payload}")
            response = requests.post(
                StockFetcher.BASE_URL, json=payload, headers=StockFetcher.HEADERS
            )
            response.raise_for_status()
            data = response.json()
            if "records" not in data:
                logger.warning(f"Missing 'records' in API response: {data}")
                return []

            stocks_data = StockFetcher.parse_response(data)
            stocks_with_details = attach_details_to_stocks(stocks_data)
            stocks_with_news = attach_news_to_stocks(stocks_with_details)
            return stocks_with_news

        except requests.exceptions.RequestException as e:
            logger.error(f"Request error fetching stocks with filters {stock_filters}: {e}")
        except ValueError as e:
            logger.error(f"Error parsing JSON response for filters {stock_filters}: {e}")
        except Exception as e:
            logger.error(f"Unexpected error fetching stocks: {e}")

    @staticmethod
    def parse_response(data: dict) -> List[dict]:
        """
        Parse the API response and extract required fields.
        """
        try:
            if not isinstance(data, dict):
                logger.error(f"Expected response to be a dictionary, got {type(data)}.")
                return []

            records = data.get("records", [])
            if not isinstance(records, list):
                logger.error(f"'records' should be a list, got {type(records)}. Response: {data}")
                return []

            return [
                {
                    "growwContractId": record.get("growwContractId"),
                    "companyName": record.get("companyName"),
                    "companyShortName": record.get("companyShortName"),
                    "searchId": record.get("searchId"),
                    "nseScriptCode": record.get("nseScriptCode"),
                    "bseScriptCode": record.get("bseScriptCode"),
                }
                for record in records if record.get("growwContractId") and record.get("companyName")
            ]
        except Exception as e:
            logger.error(f"Error parsing response records: {e}")

