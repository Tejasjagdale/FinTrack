from datetime import datetime
import json
import os 
from cronJobs.asyncFunctions import fetch_all_reccomendations, fetch_all_stocks_json
from drive import check_file_exists_in_drive, download_json_from_drive
import models.bestPromt, models.bestPromtHE
from service.dataToPromt import data_to_promt
from service.fetchAllStocks import StockFilters, StockFetcher  # Assuming StockFetcher has fetch_all_stocks
from apscheduler.schedulers.background import BackgroundScheduler # type: ignore
from apscheduler.triggers.interval import IntervalTrigger # type: ignore
from pydantic import BaseModel # type: ignore
from fastapi import FastAPI , BackgroundTasks # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from fastapi.staticfiles import StaticFiles # type: ignore
import logging

from service.fetchCharts import fetch_stock_chart
from service.liveMintAPI import fetch_and_transform_data


logging.basicConfig(level=logging.INFO)

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust based on your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Include POST, OPTIONS, etc.
    allow_headers=["*"],
)


status_all = "idel"
status_recommendation="idel"

@app.get("/")
async def root():
    return "server is live"

# Endpoint to start fetching stocks and update the status
@app.post("/allstocks")
async def all_stocks(stock_filters: StockFilters, background_tasks: BackgroundTasks):
    global status_all
    # Set the status to "running"
    status_all = "running"

    try:
        # Start the background task to fetch the stocks asynchronously
        background_tasks.add_task(fetch_all_stocks_json, stock_filters)
        status_all = "ideal"
        return {"status": "running", "message": "Your request has been received."}
    except Exception as e:
        status_all = "error"  # Update status to "error" if an exception occurs
        return {"status": "error", "message": str(e)}
    
# Endpoint to check the status and return the data once the task is completed
@app.get("/check_status")
async def check_status():
    global status_all
    logging.info(f"Status is : {status_all}")
    if check_file_exists_in_drive("stockNews.json") and status_all != "running":
            try:
                data = download_json_from_drive("stockNews.json")
                return {"status": "idel", "data": data}
            except Exception as e:
                # If any error occurs, set status to "error"
                status_all = "error"
                return {"status": "error", "message": str(e)}
    elif status_all == "running":
        return {"status": "running", "message": "Fetching data, please wait."}
    else:
        return {"status": "idel", "message": "Task has not been started yet."}


class StockFiltersPlus(StockFilters):
    modelType: str


@app.post("/get/stocks/Recommendation/news")
async def stock_recommendation(stockFiltersPlus: StockFiltersPlus, background_tasks: BackgroundTasks):
    global status_recommendation
    # Set the status to "running" for recommendations
    status_recommendation = "running"

    try:
        # Start the background task to fetch the recommendations asynchronously
        background_tasks.add_task(fetch_all_reccomendations, stockFiltersPlus)
        status_recommendation = "ideal"
        return {"status": "running", "message": "Your request has been received."}
    
    except Exception as e:
        status_recommendation = "error"  # Update status to "error" if an exception occurs
        return {"status": "error", "message": str(e)}
    
# New check_status function for recommendation task
@app.get("/check_recommendation_status")
async def check_recommendation_status():
    global status_recommendation
    logging.info(f"Status is : {status_recommendation}")
    if check_file_exists_in_drive("geminiList.json") and status_recommendation != "running":
        try:
            data = download_json_from_drive("geminiList.json")
            return {"status": "idel", "data": data}
        except Exception as e:
            # If any error occurs, set status to "error"
            status_recommendation = "error"  # Update global status
            return {"status": "error", "message": str(e)}
    elif status_recommendation == "running":
        return {"status": "running", "message": "Fetching recommendations, please wait."}
    else:
        return {"status": "idel", "message": "Recommendation task has not been started yet."}
    
@app.get("/livemint")
async def get_liveMintData():
    transformed_data = fetch_and_transform_data()
    return transformed_data

@app.get("/api/stock-chart")
async def get_stock_chart(stock_name: str,
                          timeline: str ):
    """
    API endpoint to fetch stock chart data.
    :param stock_name: Name of the stock
    :param timeline: Timeline type
    :return: JSON response with candles, changeValue, and changePerc
    """
    return await fetch_stock_chart(stock_name, timeline)