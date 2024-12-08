# Async function to fetch all stocks and write them to a JSON file
import json
import os
from service.fetchAllStocks import StockFetcher, StockFilters
from service.dataToPromt import data_to_promt # type: ignore
from models import bestPromt,bestPromtHE
import logging

class StockFiltersPlus(StockFilters):
    modelType: str

async def fetch_all_stocks_json(stock_filters: StockFilters):
    global status
    try:
        # Fetching stocks
        stock_data = await StockFetcher().fetch_all_stocks(stock_filters)
        logging.info(f"***** code moved ahead of API calls  with length {len(stock_data)}****")
        if os.path.exists("stocknews.json"):
            logging.info(f"***** Json file got removed ****")
            os.remove("stocknews.json")
        
        # Writing the fetched data to a JSON file
        with open("stocknews.json", "w") as json_file:
            json.dump(stock_data, json_file, indent=4)
        
        # Set the status to "completed" after successful execution
        status = "completed"
        logging.info(f"status is : {status}")
        return
    
    except Exception as e:
        # If any error occurs, set status to "error"
        status = "error"
        return {"error": str(e)}
    

async def fetch_all_reccomendations(stockFiltersPlus: StockFiltersPlus):
    global status_recommendation
    promtsList = []
    try:
        logging.info("Starting to fetch recommendations")

        if os.path.exists("geminiList.json"):
            os.remove("geminiList.json")

        if os.path.exists("stocknews.json"):
            with open("stocknews.json", "r") as json_file:
                logging.info("Reading stock news from file")
                allStockList = json.load(json_file)
                promtsList = data_to_promt(allStockList)
        else:
            logging.info("Fetching stocks since stocknews.json does not exist")
            allStockList = await StockFetcher().fetch_all_stocks(stockFiltersPlus)  # Assuming this fetches stock data
            promtsList =data_to_promt(allStockList)


        # Get responses for the prompts
        Model_List = (
            bestPromt.get_responses_for_prompts(promtsList)
            if stockFiltersPlus.modelType == "normal"
            else bestPromtHE.get_responses_for_prompts(promtsList)
        )
        

        # Write the model list to a JSON file
        with open("geminiList.json", "w") as json_file:
            json.dump(Model_List, json_file, indent=4)

        # Set the status to "completed"
        status_recommendation = "completed"
        logging.info("Recommendation fetching completed successfully.")

    except Exception as e:
        # Log the exception
        logging.error(f"Error occurred during recommendation fetching: {str(e)}")
        status_recommendation = "error"
        return {"error": str(e)}

