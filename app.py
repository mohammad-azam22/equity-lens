import numpy as np
import pandas as pd
import json

from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor
from pandas.tseries.offsets import BDay

import yfinance as yf

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def download_data(ticker, input_length, target_col):
    df = yf.download(ticker, period=f"{input_length}mo")
    df = df[[target_col]].dropna()
    return df

def scale_data(data):
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(data)
    scaled_df = pd.DataFrame(
        scaled,
        index=data.index,
        columns=data.columns
    )
    return scaler, scaled_df

def create_lag_features(df, target_col, max_lag=7):
    lagged_df = df.copy()

    for lag in range(1, max_lag + 1):
        lagged_df[f"{target_col}_lag_{lag}"] = df[target_col].shift(lag)

    lagged_df.dropna(inplace=True)
    return lagged_df

def train_model(lagged_df, target_col):
    X = lagged_df.drop(columns=[target_col])
    y = lagged_df[target_col]

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42
    )
    model.fit(X, y)

    return model

def walk_forward_predict(model, lagged_df, target_col, output_length, max_lag=7):
    current_lagged_df = lagged_df.copy()
    
    for _ in range(output_length):       
        row = []
        for lag in range(1, max_lag + 1):
            row.append(current_lagged_df[target_col].iloc[-lag])
        row = np.array(row).reshape(1, -1)
        pred = model.predict(row)

        last_date = current_lagged_df.index[-1]
        current_lagged_df.loc[last_date + BDay(1)] = np.insert(row, 0, pred)

    return current_lagged_df

@app.route("/<string:ticker>/data", methods=["POST"])
def get_data(ticker):
    data = request.get_json()
    from_date = data.get("from_date")
    to_date = data.get("to_date")

    df = yf.download(ticker, start=from_date, end=to_date)
    result = {
        "dates": df.index.astype(str).tolist(),
        "low": df["Low"].values[:,0].tolist(),
        "high": df["High"].values[:,0].tolist(),
        "open": df["Open"].values[:,0].tolist(),
        "close": df["Close"].values[:,0].tolist(),
        "volume": df["Volume"].values[:,0].tolist(),
        "currency": yf.Ticker(ticker).info["currency"]
    }
    return jsonify(result)

@app.route("/<string:ticker>/info", methods=["GET"])
def get_info(ticker):
    info = yf.Ticker(ticker).info
    result = {}
    result["longName"] = info.get("longName")
    result["symbol"] = info.get("symbol")
    result["industryDisp"] = info.get("industryDisp")
    result["sectorDisp"] = info.get("sectorDisp")
    result["longBusinessSummary"] = info.get("longBusinessSummary")
    result["fullTimeEmployees"] = info.get("fullTimeEmployees")
    result["website"] = info.get("website")
    result["address1"] = info.get("address1")
    result["city"] = info.get("city")
    result["zip"] = info.get("zip")
    result["state"] = info.get("state")
    result["country"] = info.get("country")
    result["phone"] = info.get("phone")
    result["region"] = info.get("region")
    result["currentPrice"] = info.get("currentPrice")
    result["open"] = info.get("open")
    result["previousClose"] = info.get("previousClose")
    result["dayHigh"] = info.get("dayHigh")
    result["dayLow"] = info.get("dayLow")
    result["fiftyTwoWeekHigh"] = info.get("fiftyTwoWeekHigh")
    result["fiftyTwoWeekLow"] = info.get("fiftyTwoWeekLow")
    result["volume"] = info.get("volume")
    result["averageVolume"] = info.get("averageVolume")
    result["marketCap"] = info.get("marketCap")
    result["trailingPE"] = info.get("trailingPE")
    result["forwardPE"] = info.get("forwardPE")
    result["priceToBook"] = info.get("priceToBook")
    result["priceToSalesTrailing12Months"] = info.get("priceToSalesTrailing12Months")
    result["trailingPegRatio"] = info.get("trailingPegRatio")
    result["totalRevenue"] = info.get("totalRevenue")
    result["netIncomeToCommon"] = info.get("netIncomeToCommon")
    result["revenueGrowth"] = info.get("revenueGrowth")
    result["earningsGrowth"] = info.get("earningsGrowth")
    result["profitMargins"] = info.get("profitMargins")
    result["returnOnEquity"] = info.get("returnOnEquity")
    result["dividendRate"] = info.get("dividendRate")
    result["dividendYield"] = info.get("dividendYield")
    result["payoutRatio"] = info.get("payoutRatio")
    result["exDividendDate"] = info.get("exDividendDate")
    result["lastDividendValue"] = info.get("lastDividendValue")
    result["targetMeanPrice"] = info.get("targetMeanPrice")
    result["targetHighPrice"] = info.get("targetHighPrice")
    result["targetLowPrice"] = info.get("targetLowPrice")
    result["recommendationKey"] = " ".join(info.get("recommendationKey").split("_")).title()
    result["numberOfAnalystOpinions"] = info.get("numberOfAnalystOpinions")
    result["earningsTimestamp"] = info.get("earningsTimestamp")
    return jsonify(result)

@app.route("/options", methods=["GET"])
def get_options():
    with open("./tickers.json", "r") as f_in:
        return json.load(f_in)

@app.route("/<string:ticker>/predict", methods=["POST"])
def pipeline(ticker):
    ticker = ticker.upper()
    data = request.get_json()
    output_length = int(data.get("pred_duration"))

    target_col = "Close"

    input_length = output_length * 4
    max_lag = max(output_length * 2, 7)

    data = download_data(ticker, input_length, target_col)
    scaler, scaled_df = scale_data(data)
    lagged_df = create_lag_features(scaled_df, target_col, max_lag)

    model = train_model(lagged_df, target_col)

    pred_df = walk_forward_predict(model, lagged_df, target_col, output_length, max_lag)
    pred_df[target_col] = scaler.inverse_transform(pred_df[target_col])
    result = {
        "dates": list(pred_df[target_col].index.map(str)), 
        "values": list(pred_df[target_col].values[:,0]), 
        "currency": yf.Ticker(ticker).info["currency"]
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=False, host='0.0.0.0', port=9696)
