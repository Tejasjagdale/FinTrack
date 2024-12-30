from service.fetchNiftyStocks import fetch_nifty100
import os
import yfinance as yf
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model


def checkModelPresent(nifty_data_list):
    directory = os.getcwd().replace("service", "trainedModels")
    model_predictions = {}
    for stocks_name in nifty_data_list:
        file_path = os.path.join(directory, "model_"+stocks_name+".H5")
        if os.path.isfile(file_path):
            print(f"The file '{stocks_name}' is present in the '{directory}' directory.")
            historical_end_date = (pd.Timestamp.today() - pd.DateOffset(months=1)).strftime(
                '%Y-%m-%d')  # 1 month before today
            try:
                model = load_model(file_path)
                predictions = predict_stock_prices(stocks_name, model, prediction_days=5, end_date=historical_end_date)
                # if predictions is not None:
                #     # get_trend(ticker, predictions['Close'])
                #     visualize_predictions(stocks_name, predictions)
                model_predictions[stocks_name] = predictions
            except Exception as e:
                print(f"An error occurred for {stocks_name}: {e}")
        else:
            print(f"The file '{stocks_name}' is NOT present in the '{directory}' directory.")
    return model_predictions

def fetchPredictions():
    nifty_data = fetch_nifty100()
    nifty_data_list = []
    for stock in nifty_data['records']:
        nifty_data_list.append(stock['nseScriptCode']+".NS")
    return checkModelPresent(nifty_data_list[:4])


fetchPredictions()
trend_dict = {}


# Prediction function for a single ticker with an optional historical end date
def predict_stock_prices(ticker, model, prediction_days=5, end_date=None):
    print(f"\nPredicting for {ticker}...")

    # Adjust the data fetching to use an end_date if provided
    if end_date:
        end_date = pd.to_datetime(end_date).strftime('%Y-%m-%d')  # Ensure proper date format
        start_date = (pd.to_datetime(end_date) - pd.DateOffset(months=3)).strftime('%Y-%m-%d')
        data = yf.download(ticker, start=start_date, end=end_date, interval='1d')
    else:
        # Default to the last 3 months of data
        data = yf.download(ticker, period='3mo', interval='1d')

    if len(data) < 60:
        print(f"Not enough data to make predictions for {ticker}. Need at least 60 days of data.")
        return None

    # Select the 'Close' price
    closing_prices = data['Close'].values.reshape(-1, 1)

    # Scale the data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(closing_prices)

    # Prepare the last 60 days for prediction
    current_batch = scaled_data[-60:].reshape(1, 60, 1)

    # Predict for the next `prediction_days`
    predicted_prices = []
    for _ in range(prediction_days):
        # Predict the next day's price
        next_prediction = model.predict(current_batch)

        # Append the prediction to the batch
        current_batch = np.append(current_batch[:, 1:, :], next_prediction.reshape(1, 1, 1), axis=1)

        # Inverse transform the prediction to the original price scale
        predicted_prices.append(scaler.inverse_transform(next_prediction)[0, 0])

    # Create a DataFrame for the predictions
    last_date = data.index[-1]
    prediction_dates = pd.date_range(start=last_date + pd.Timedelta(days=1), periods=prediction_days)
    predictions_df = pd.DataFrame(index=prediction_dates, data=predicted_prices, columns=['Close'])

    return predictions_df


# Visualization function
def visualize_predictions(ticker, predictions_df):
    # Overlay the predicted data
    plt.figure(figsize=(10, 6))
    plt.plot(predictions_df.index, predictions_df['Close'], linestyle='dashed', marker='o', color='red',
             label='Predicted')
    plt.title(f"{ticker} Stock Price Predictions for Next 5 Days")
    plt.xlabel("Date")
    plt.ylabel("Predicted Stock Price")
    plt.legend()

    # Save the plot as a PNG file in the local directory
    filename = f"{ticker}_predictions.png"
    plt.savefig(filename)
    print(f"Plot saved as {filename}")

    # Display the plot
    plt.show()


# Trend marker
# def get_trend(ticker_name, data):
#     trend = []
#     for i in range(1, len(data)):
#         if data[i] < data[i - 1]:
#             trend.append('down')
#         elif data[i] > data[i - 1]:
#             trend.append('up')
#         else:
#             trend.append('flat')
#         trend_dict[ticker] = trend

