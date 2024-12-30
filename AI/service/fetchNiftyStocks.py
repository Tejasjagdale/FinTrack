import requests


def fetch_nifty100():
    try:
        # Fetch data from the API 100-nifty-218500
        response = requests.get("https://groww.in/v1/api/stocks_data/v1/company/search_id/nifty-218500")
        response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)

        data = response.json()  # Parse the JSON response
        child_assets = data.get("childAssets", [])

        # Transform the data into the desired format
        nifty100 = []
        for asset in child_assets:
            header = asset.get("header", {})
            filtered_asset = {
                "searchId": header.get("searchId"),
                "growwCompanyId": header.get("growwCompanyId"),
                "industryName": header.get("industryName"),
                "displayName": header.get("displayName"),
                "shortName": header.get("shortName"),
                "nseScriptCode": header.get("nseScriptCode"),
                "bseScriptCode": header.get("bseScriptCode"),
                "nseTradingSymbol": header.get("nseTradingSymbol"),
                "bseTradingSymbol": header.get("bseTradingSymbol"),
            }
            nifty100.append(filtered_asset)

        return {"records": nifty100}

    except requests.exceptions.RequestException as e:
        print(f"Error fetching the data: {e}")
        return {"records": []}
