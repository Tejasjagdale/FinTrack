import httpx
from fastapi import HTTPException

# Base URL for the Groww API
BASE_URL = "https://groww.in/v1/api/charting_service/v2/chart/exchange/NSE/segment/CASH"

# API endpoints for different timelines
TIMELINE_ENDPOINTS = {
    "weekly": "weekly?intervalInMinutes=5&minimal=true",
    "monthly": "monthly?intervalInMinutes=30&minimal=true",
    "3months": "monthly/v2?months=3&minimal=true",
    "6months": "monthly/v2?months=6&minimal=true",
    "1year": "1y?intervalInDays=1&minimal=true",
    "3years": "3y?intervalInDays=3&minimal=true",
    "5years": "5y?intervalInDays=5&minimal=true",
    "all": "all?noOfCandles=300",
}

async def fetch_stock_chart(stock_name: str, timeline: str) -> dict:
    """
    Fetch stock chart data for a specific stock and timeline from the Groww API.
    :param stock_name: Name of the stock (e.g., "ZOMATO")
    :param timeline: Timeline type (e.g., "weekly", "monthly", etc.)
    :return: JSON response in the required format
    """
    if timeline not in TIMELINE_ENDPOINTS:
        raise HTTPException(
            status_code=400,
            detail="Invalid timeline. Choose from: weekly, monthly, 3months, 6months, 1year, 3years, 5years, all."
        )
    
    # Build the API URL
    url = f"{BASE_URL}/{stock_name}/{TIMELINE_ENDPOINTS[timeline]}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch data from Groww API.")
    
    # Parse the API response
    data = response.json()
    candles = data.get("candles", [])
    if not candles:
        raise HTTPException(status_code=404, detail="No candle data found in the API response.")
    
    # Compute changeValue and changePerc
    first_price = candles[0][1] if candles else 0
    last_price = candles[-1][1] if candles else 0
    change_value = last_price - first_price
    change_perc = (change_value / first_price) if first_price != 0 else 0
    
    # Format the response
    return {
        "candles": candles,
        "changeValue": round(change_value, 2),
        "changePerc": round(change_perc, 6),
    }
