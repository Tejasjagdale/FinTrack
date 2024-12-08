import requests

api_url = "https://www.livemint.com/lm-img/markets/prod/mintgeniemarketdashboardfeed.json"

def fetch_and_transform_data():
    response = requests.get(api_url)
    if response.status_code == 200:
        data = response.json()
        
        # Initialize the transformed data dictionary
        transformed_data = {
            "nse_top_gainer_losers": [],
            "top_gainer_losers": [],
            "nse_market_vol_most_active": [],
            "market_vol_most_active": [],
            "price_volume_shocker": []
        }

        # Process the data and directly populate the transformed_data fields
        for item in data["data"]:
            if isinstance(item, dict):  # Ensure the item is a dictionary
                node = item.get('node', '')
                
                # For 'nse_top_gainer_losers'
                if node == 'nse_top_gainer_losers':
                    # Merge topGainers and topLooser into a single list
                    top_gainers = item['data'].get('topGainers', [])
                    top_looser = item['data'].get('topLooser', [])
                    transformed_data['nse_top_gainer_losers'] = top_gainers + top_looser

                # For 'top_gainer_losers'
                elif node == 'top_gainer_losers':
                    top_gainers = item['data'].get('topGainers', [])
                    top_looser = item['data'].get('topLooser', [])
                    transformed_data['top_gainer_losers'] = top_gainers + top_looser

                # For 'nse_market_vol_most_active'
                elif node == 'nse_market_vol_most_active':
                    transformed_data['nse_market_vol_most_active'] = item['data']

                # For 'market_vol_most_active'
                elif node == 'market_vol_most_active':
                    transformed_data['market_vol_most_active'] = item['data']

                # For 'price_volume_shocker'
                elif node == 'price_volume_shocker':
                    BSE_gainers = item['data'].get('BSE_PriceShocker', [])
                    NSE_looser = item['data'].get('NSE_PriceShocker', [])
                    transformed_data['price_volume_shocker'] = BSE_gainers + NSE_looser

        return transformed_data
    else:
        return {"error": "Failed to fetch data"}
