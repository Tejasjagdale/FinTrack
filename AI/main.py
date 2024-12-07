from datetime import datetime
import json
import os 
from cronJobs.asyncFunctions import fetch_all_reccomendations, fetch_all_stocks_json
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

class StockFiltersPlus(StockFilters):
    modelType: str

@app.get("/")
async def root():
    return "server is live"

status = "pending"
# Endpoint to start fetching stocks and update the status
@app.post("/allstocks")
async def all_stocks(stock_filters: StockFilters, background_tasks: BackgroundTasks):
    global status
    
    # Set the status to "in-progress"
    status = "in-progress"

    try:
        # Start the background task to fetch the stocks asynchronously
        background_tasks.add_task(fetch_all_stocks_json, stock_filters)
        
        return {"status": "in-progress", "message": "Your request has been received."}
    
    except Exception as e:
        status = "error"  # Update status to "error" if an exception occurs
        return {"status": "error", "message": str(e)}
    
# Endpoint to check the status and return the data once the task is completed
@app.get("/check_status")
async def check_status():
    global status
    logging.info(f"Status is : {status}")
    if os.path.exists("stocknews.json"):
            try:
                with open("stocknews.json", "r") as json_file:
                    data = json.load(json_file)
                return {"status": "completed", "data": data}
            except Exception as e:
                # If any error occurs, set status to "error"
                status = "error"
                return {"status": "error", "message": str(e)}
    elif status == "in-progress":
        return {"status": "in-progress", "message": "Fetching data, please wait."}
    else:
        return {"status": "pending", "message": "Task has not been started yet."}
        

status_recommendation = "pending"
@app.post("/get/stocks/Recommendation/news")
async def stock_recommendation(stockFiltersPlus: StockFiltersPlus, background_tasks: BackgroundTasks):
    global status_recommendation
    
    # Set the status to "in-progress" for recommendations
    status_recommendation = "in-progress"

    try:
        # Start the background task to fetch the recommendations asynchronously
        background_tasks.add_task(fetch_all_reccomendations, stockFiltersPlus)
        
        return {"status": "in-progress", "message": "Your request has been received."}
    
    except Exception as e:
        status_recommendation = "error"  # Update status to "error" if an exception occurs
        return {"status": "error", "message": str(e)}
    
# New check_status function for recommendation task
@app.get("/check_recommendation_status")
async def check_recommendation_status():
    global status_recommendation  # Declare it as global
    logging.info(f"Status is : {status_recommendation}")
    if os.path.exists("geminiList.json"):
        try:
            with open("geminiList.json", "r") as json_file:
                data = json.load(json_file)
            return {"status": "completed", "data": data}
        except Exception as e:
            # If any error occurs, set status to "error"
            status_recommendation = "error"  # Update global status
            return {"status": "error", "message": str(e)}
    elif status_recommendation == "in-progress":
        return {"status": "in-progress", "message": "Fetching recommendations, please wait."}
    else:
        return {"status": "pending", "message": "Recommendation task has not been started yet."}