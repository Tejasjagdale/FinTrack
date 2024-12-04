from typing import List, Union
import models.bestPromt, models.bestPromtHE
from service.dataToPromt import data_to_promt
from service.fetchAllStocks import StockFilters, StockFetcher  # Assuming StockFetcher has fetch_all_stocks
from pydantic import BaseModel # type: ignore
from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from fastapi.staticfiles import StaticFiles # type: ignore

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust based on your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Include POST, OPTIONS, etc.
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return "server is live"

@app.post("/allstocks")
async def all_stocks(stockFilters: StockFilters):
    # Use StockFetcher class to fetch stocks data
    return await StockFetcher().fetch_all_stocks(stockFilters)

class StockFiltersPlus(StockFilters):
    modelType: str

@app.post("/get/stocks/Recommendation/news")
async def stock_recommendation(stockFiltersPlus: StockFiltersPlus):
    allStockList = await StockFetcher().fetch_all_stocks(stockFiltersPlus)  # You should implement fetch_all_stocks here
    promtsList = data_to_promt(allStockList)
    return (models.bestPromt.get_responses_for_prompts(promtsList) if stockFiltersPlus.modelType == "normal" else models.bestPromtHE.get_responses_for_prompts(promtsList))
