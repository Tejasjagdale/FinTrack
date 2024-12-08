# Async function to fetch all stocks and write them to a JSON file
import json
import os
from db.CacheFile import globalVariables,cache
from drive import check_file_exists_in_drive, delete_file_from_drive, download_json_from_drive, upload_json_to_drive
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

        if check_file_exists_in_drive("stockNews.json"):
           delete_file_from_drive("stockNews.json")
        
        # Writing the fetched data to a JSON file
        upload_json_to_drive(stock_data,"stockNews.json")
        # Set the status to "completed" after successful execution
        globalVariables.status = "idel"
        logging.info(f"status is : {globalVariables.status}")
        return
    
    except Exception as e:
        # If any error occurs, set status to "error"
        globalVariables.status = "error"
        return {"error": str(e)}
    

async def fetch_all_reccomendations(stockFiltersPlus: StockFiltersPlus):
    promtsList = []
    try:
        logging.info("Starting to fetch recommendations")

        if check_file_exists_in_drive("geminiList.json"):
            delete_file_from_drive("geminiList.json")

        if check_file_exists_in_drive("stockNews.json") and stockFiltersPlus.num_stocks == 10:
            allStockList = download_json_from_drive("stockNews.json")
            promtsList = data_to_promt(allStockList)
        else:
            logging.info("Fetching stocks since stocknews.json does not exist")
            allStockList = await StockFetcher().fetch_all_stocks(stockFiltersPlus)  # Assuming this fetches stock data
            upload_json_to_drive(allStockList,"stockNews.json")
            promtsList = data_to_promt(allStockList)


        # Get responses for the prompts
        Model_List = bestPromt.get_responses_for_prompts(promtsList)
            
        # Write the model list to a JSON file
        upload_json_to_drive(Model_List,"geminiList.json")
        # Set the status to "completed"
        globalVariables.status_recommendation = "idel"
        logging.info("Recommendation fetching completed successfully.")

    except Exception as e:
        # Log the exception
        logging.error(f"Error occurred during recommendation fetching: {str(e)}")
        globalVariables.status_recommendation = "error"
        return {"error": str(e)}

