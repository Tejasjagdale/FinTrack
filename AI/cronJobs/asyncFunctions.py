# Async function to fetch all stocks and write them to a JSON file
import json
import os
from db.CacheFile import SetStatusIdel, SetStatusIdelR
from drive import check_file_exists_in_drive, delete_file_from_drive, download_json_from_drive, update_json_file_in_drive
from service.fetchAllStocks import StockFetcher, StockFilters
from service.dataToPromt import data_to_promt # type: ignore
from models import bestPromt,bestPromtHE
import logging

class StockFiltersPlus(StockFilters):
    modelType: str

async def fetch_all_stocks_json(stock_filters: StockFilters):
    try:
        # Fetching stocks
        stock_data = await StockFetcher().fetch_all_stocks(stock_filters)

        update_json_file_in_drive(stock_data,"stockNews.json")
        SetStatusIdel()
        return stock_data
    
    except Exception as e:
        SetStatusIdel()
        return {"error": str(e)}
    

async def fetch_all_reccomendations(stockFiltersPlus: StockFiltersPlus):
    promtsList = []
    try:
        logging.info("Starting to fetch recommendations")

        if check_file_exists_in_drive("stockNews.json") and stockFiltersPlus.num_stocks == 10:
            allStockList = download_json_from_drive("stockNews.json")
            promtsList = data_to_promt(allStockList)
        else:
            logging.info("Fetching stocks since stocknews.json does not exist")
            allStockList = await StockFetcher().fetch_all_stocks(stockFiltersPlus)  # Assuming this fetches stock data
            update_json_file_in_drive(allStockList,"stockNews.json")
            promtsList = data_to_promt(allStockList)


        # Get responses for the prompts
        Model_List = bestPromt.get_responses_for_prompts(promtsList)
            
        # Write the model list to a JSON file
        update_json_file_in_drive(Model_List,"geminiList.json")
        SetStatusIdelR()
        logging.info("Recommendation fetching completed successfully.")
        return Model_List

    except Exception as e:
        # Log the exception
        logging.error(f"Error occurred during recommendation fetching: {str(e)}")
        SetStatusIdelR()
        return {"error": str(e)}

