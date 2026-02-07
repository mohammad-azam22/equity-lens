
let historicalDataChart1;
let historicalDataChart2;
let predictionChart;
let timer;

const slider = document.getElementById("days");
const daysValue = document.getElementById("daysValue");
slider.oninput = () => {
    daysValue.textContent = slider.value;
};

/* ---------- PING SERVER ---------- */
document.querySelector(".server").addEventListener("click", pingServer);

async function pingServer() {
    document.querySelector(".server > span").innerText = "Please wait...";
    
    await fetch(`https://equity-lens.onrender.com/GOOG/data`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from_date: "2020-03-27",
            to_date: "2020-04-02"
        })
    })
        .then(response => {
            document.querySelector(".server > span").innerText = "Server Online";
            document.querySelector(".server > .pulse-dot").style.backgroundColor = "#3bff4e";
            document.querySelector(".server > .pulse-dot").style.boxShadow = "0 0 0 0 rgba(62, 255, 62, 0.7)";
        })
        .catch(err => {
            console.error(err);
            document.querySelector(".server > span").innerText = "Server Offline";
            document.querySelector(".server > .pulse-dot").style.backgroundColor = "#ff3b3b";
            document.querySelector(".server > .pulse-dot").style.boxShadow = "0 0 0 0 rgba(255, 59, 59, 0.7)";
        });

    clearTimeout(timer);
    timer = setTimeout(() => {
        document.querySelector(".server > span").innerText = "Server Offline";
        document.querySelector(".server > .pulse-dot").style.backgroundColor = "#ff3b3b";
        document.querySelector(".server > .pulse-dot").style.boxShadow = "0 0 0 0 rgba(255, 59, 59, 0.7)";
    }, 60000);
}

/* ---------- FETCHING OPTIONS ---------- */
async function getOptions() {
    pingServer();
    const response = await fetch("https://equity-lens.onrender.com/options");
    const data = await response.json();
    const options = document.getElementById("tickers");

    options.innerHTML = "";
    if (!options.hasChildNodes()) {
        Object.keys(data.symbol).forEach((key) => {
            let option = document.createElement("option")
            option.setAttribute("value", `${data.symbol[key]} - ${data.name[key]}`);
            options.appendChild(option)
        })
    }
}
getOptions();

/* ---------- FETCHING COMPANY INFORMATION ---------- */
async function getInfo() {
    pingServer();
    let ticker = document.getElementById("ticker").value
    if (!ticker) return;

    ticker = ticker.split(" ")[0];
    const response = await fetch(`https://equity-lens.onrender.com/${ticker}/info`);
    const data = await response.json();

    document.getElementById("longName").innerText = data["longName"] != null ? data["longName"] : "—";
    document.getElementById("symbol").innerText = data["symbol"] != null ? data["symbol"] : "—";
    document.getElementById("industryDisp").innerText = data["industryDisp"] != null ? data["industryDisp"] : "—";
    document.getElementById("sectorDisp").innerText = data["sectorDisp"] != null ? data["sectorDisp"] : "—";
    document.getElementById("fullTimeEmployees").innerText = data["fullTimeEmployees"] != null ? data["fullTimeEmployees"] : "—";
    document.getElementById("website").innerText = data["website"] != null ? data["website"] : "—";
    document.getElementById("longBusinessSummary").innerText = data["longBusinessSummary"] != null ? data["longBusinessSummary"] : "—";

    document.getElementById("address1").innerText = data["address1"] != null ? data["address1"] : "—";
    document.getElementById("city").innerText = data["city"] != null ? data["city"] : "—";
    document.getElementById("zip").innerText = data["zip"] != null ? data["zip"] : "—";
    document.getElementById("state").innerText = data["state"] != null ? data["state"] : "—";
    document.getElementById("country").innerText = data["country"] != null ? data["country"] : "—";
    document.getElementById("phone").innerText = data["phone"] != null ? data["phone"] : "—";
    document.getElementById("region").innerText = data["region"] != null ? data["region"] : "—";

    document.getElementById("currentPrice").innerText = data["currentPrice"] != null ? data["currentPrice"] : "—";
    document.getElementById("open").innerText = data["open"] != null ? data["open"] : "—";
    document.getElementById("previousClose").innerText = data["previousClose"] != null ? data["previousClose"] : "—";
    document.getElementById("dayHigh").innerText = data["dayHigh"] != null ? data["dayHigh"] : "—";
    document.getElementById("dayLow").innerText = data["dayLow"] != null ? data["dayLow"] : "—";
    document.getElementById("fiftyTwoWeekHigh").innerText = data["fiftyTwoWeekHigh"] != null ? data["fiftyTwoWeekHigh"] : "—";
    document.getElementById("fiftyTwoWeekLow").innerText = data["fiftyTwoWeekLow"] != null ? data["fiftyTwoWeekLow"] : "—";
    document.getElementById("volume").innerText = data["volume"] != null ? data["volume"] : "—";
    document.getElementById("averageVolume").innerText = data["averageVolume"] != null ? data["averageVolume"] : "—";

    document.getElementById("marketCap").innerText = data["marketCap"] != null ? data["marketCap"] : "—";
    document.getElementById("trailingPE").innerText = data["trailingPE"] != null ? data["trailingPE"] : "—";
    document.getElementById("forwardPE").innerText = data["forwardPE"] != null ? data["forwardPE"] : "—";
    document.getElementById("priceToBook").innerText = data["priceToBook"] != null ? data["priceToBook"] : "—";
    document.getElementById("priceToSalesTrailing12Months").innerText = data["priceToSalesTrailing12Months"] != null ? data["priceToSalesTrailing12Months"] : "—";
    document.getElementById("trailingPegRatio").innerText = data["trailingPegRatio"] != null ? data["trailingPegRatio"] : "—";

    document.getElementById("totalRevenue").innerText = data["totalRevenue"] != null ? data["totalRevenue"] : "—";
    document.getElementById("netIncomeToCommon").innerText = data["netIncomeToCommon"] != null ? data["netIncomeToCommon"] : "—";
    document.getElementById("revenueGrowth").innerText = data["revenueGrowth"] != null ? data["revenueGrowth"] : "—";
    document.getElementById("earningsGrowth").innerText = data["earningsGrowth"] != null ? data["earningsGrowth"] : "—";
    document.getElementById("profitMargins").innerText = data["profitMargins"] != null ? data["profitMargins"] : "—";
    document.getElementById("returnOnEquity").innerText = data["returnOnEquity"] != null ? data["returnOnEquity"] : "—";

    document.getElementById("dividendRate").innerText = data["dividendRate"] != null ? data["dividendRate"] : "—";
    document.getElementById("dividendYield").innerText = data["dividendYield"] != null ? data["dividendYield"] : "—";
    document.getElementById("payoutRatio").innerText = data["payoutRatio"] != null ? data["payoutRatio"] : "—";
    document.getElementById("exDividendDate").innerText = data["exDividendDate"] != null ? new Date(parseInt(data["exDividendDate"]) * 1000).toUTCString() : "—";
    document.getElementById("lastDividendValue").innerText = data["lastDividendValue"] != null ? data["lastDividendValue"] : "—";

    document.getElementById("targetMeanPrice").innerText = data["targetMeanPrice"] != null ? data["targetMeanPrice"] : "—";
    document.getElementById("targetHighPrice").innerText = data["targetHighPrice"] != null ? data["targetHighPrice"] : "—";
    document.getElementById("targetLowPrice").innerText = data["targetLowPrice"] != null ? data["targetLowPrice"] : "—";
    document.getElementById("numberOfAnalystOpinions").innerText = data["numberOfAnalystOpinions"] != null ? data["numberOfAnalystOpinions"] : "—";
    document.getElementById("recommendationKey").innerText = data["recommendationKey"] != null ? data["recommendationKey"] : "—";
    document.getElementById("earningsTimestamp").innerText = data["earningsTimestamp"] != null ? new Date(parseInt(data["earningsTimestamp"]) * 1000).toUTCString() : "—";

    if (historicalDataChart1) historicalDataChart1.destroy();
    if (historicalDataChart2) historicalDataChart2.destroy();
    if (predictionChart) predictionChart.destroy();
}
getInfo();

/* ---------- FETCHING COMPANY STOCK DATA ---------- */
async function getStockData() {
    pingServer();
    let fromDate = document.getElementById("from-date").value;
    let toDate = document.getElementById("to-date").value;
    let ticker = document.getElementById("ticker").value;

    if (!ticker || !fromDate || !toDate) return;

    let currentDate = new Date(toDate);
    currentDate.setDate(currentDate.getDate() + 1);
    let newDate = currentDate.toISOString().split("T")[0];
    toDate = newDate;

    ticker = ticker.split(" ")[0];
    const response = await fetch(`https://equity-lens.onrender.com/${ticker}/data`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from_date: fromDate,
            to_date: toDate
        })
    });
    const data = await response.json();
    renderHistoricalChart(data);
}

/* ---------- TAB SWITCHING ---------- */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        // Remove active states
        tabButtons.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));

        // Activate clicked tab
        btn.classList.add("active");

        const tabNum = btn.dataset.tab;
        document.getElementById("tab" + tabNum).classList.add("active");

        // Change background
        document.body.className = "tab" + tabNum;
    });
});

/* ---------- PREDICTION CHART ---------- */
async function getPrediction() {
    pingServer();
    let ticker = document.getElementById("ticker").value;
    const days = slider.value;
    if (!ticker) return;

    ticker = ticker.split(" ")[0];
    const response = await fetch(`https://equity-lens.onrender.com/${ticker}/predict`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pred_duration: days
        })
    });

    const data = await response.json();

    renderPredictionChart(data, days);
}


/* ---------- HISTORICAL DATA CHART ---------- */

function renderHistoricalChart(data) {
    labels = data["dates"].map((label) => {
        return label.split(" ")[0]
    })

    document.getElementById("historicalDataChart1").addEventListener("dblclick", () => {
        historicalDataChart1.resetZoom();
    });

    const ctx1 = document.getElementById("historicalDataChart1").getContext("2d");
    if (historicalDataChart1) {
        historicalDataChart1.destroy();
    }
    historicalDataChart1 = new Chart(ctx1, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Low",
                data: data["low"],
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                backgroundColor: "rgba(112, 29, 20, 0.2)",
                borderColor: "#B51900",
                pointRadius: 2,
                pointBackgroundColor: "#FFFFFF"
            },
            {
                label: "High",
                data: data["high"],
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                backgroundColor: "rgba(16, 102, 58, 0.2)",
                borderColor: "#009A4F",
                pointRadius: 2,
                pointBackgroundColor: "#FFFFFF"
            },
            {
                label: "Open",
                data: data["open"],
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                backgroundColor: "rgba(113, 19, 67, 0.2)",
                borderColor: "#75007A",
                pointRadius: 2,
                pointBackgroundColor: "#FFFFFF"
            },
            {
                label: "Close",
                data: data["close"],
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                backgroundColor: "rgba(0, 198, 255, 0.2)",
                borderColor: "#005382",
                pointRadius: 2,
                pointBackgroundColor: "#FFFFFF"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Historical Data",
                    font: {
                        size: 20,
                        weight: "bold"
                    },
                    color: "#fff",
                },
                legend: {
                    labels: { color: "#fff" }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: "x"
                    },
                    zoom: {
                        drag: {
                            enabled: true,
                            backgroundColor: "rgba(0, 198, 255, 0.15)",
                            borderColor: "#00c6ff",
                            borderWidth: 1
                        },
                        mode: "x"
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Date",
                        font: {
                            size: 16,
                            weight: "bold"
                        },
                        color: "#fff",
                        padding: 10
                    },
                    ticks: { color: "#fff" },
                    grid: { color: "rgba(255,255,255,0.1)" }
                },
                y: {
                    title: {
                        display: true,
                        text: data["currency"],
                        font: {
                            size: 16,
                            weight: "bold"
                        },
                        color: "#fff",
                        padding: 10
                    },
                    ticks: { color: "#fff" },
                    grid: { color: "rgba(255,255,255,0.1)" }
                }
            }
        }
    });

    document.getElementById("historicalDataChart2").addEventListener("dblclick", () => {
        historicalDataChart2.resetZoom();
    });

    const ctx2 = document.getElementById("historicalDataChart2").getContext("2d");
    if (historicalDataChart2) {
        historicalDataChart2.destroy();
    }
    historicalDataChart2 = new Chart(ctx2, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Volume",
                data: data["volume"],
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                backgroundColor: "rgba(0, 198, 255, 0.2)",
                borderColor: "#005382",
                pointRadius: 2,
                pointBackgroundColor: "#FFFFFF"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Volume Data",
                    font: {
                        size: 20,
                        weight: "bold"
                    },
                    color: "#fff",
                },
                legend: {
                    labels: { color: "#fff" }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: "x"
                    },
                    zoom: {
                        drag: {
                            enabled: true,
                            backgroundColor: "rgba(0, 198, 255, 0.15)",
                            borderColor: "#00c6ff",
                            borderWidth: 1
                        },
                        mode: "x"
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Date",
                        font: {
                            size: 16,
                            weight: "bold"
                        },
                        color: "#fff",
                        padding: 10
                    },
                    ticks: { color: "#fff" },
                    grid: { color: "rgba(255,255,255,0.1)" }
                },
                y: {
                    title: {
                        display: true,
                        text: "Number of Shares",
                        font: {
                            size: 16,
                            weight: "bold"
                        },
                        color: "#fff",
                        padding: 10
                    },
                    ticks: { color: "#fff" },
                    grid: { color: "rgba(255,255,255,0.1)" }
                }
            }
        }
    });
}

/* ---------- PREDICTION CHART ---------- */
function renderPredictionChart(data, days) {

    labels = data["dates"].map((label) => {
        return label.split(" ")[0]
    })

    document.getElementById("predictionChart").addEventListener("dblclick", () => {
        predictionChart.resetZoom();
    });

    const ctx3 = document.getElementById("predictionChart").getContext("2d");

    if (predictionChart) {
        predictionChart.destroy();
    }

    predictionChart = new Chart(ctx3, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Previous Price",
                data: data["values"].map((v, i) => i < data["values"].length - days + 1 ? v : null),
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                backgroundColor: "rgba(0, 198, 255, 0.2)",
                borderColor: "#0084AB",
                pointRadius: 2,
                pointBackgroundColor: "#FFFFFF"
            }, {
                label: "Predicted Price",
                data: data["values"].map((v, i) => i >= data["values"].length - days ? v : null),
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                backgroundColor: "rgba(255, 139, 0, 0.2)",
                borderColor: "#ffb100",
                pointRadius: 2,
                pointBackgroundColor: "#FFFFFF"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: document.getElementById("longName").innerText,
                    font: {
                        size: 20,
                        weight: "bold"
                    },
                    color: "#fff",
                },
                legend: {
                    labels: { color: "#fff" }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: "x"
                    },
                    zoom: {
                        drag: {
                            enabled: true,
                            backgroundColor: "rgba(0, 198, 255, 0.15)",
                            borderColor: "#00c6ff",
                            borderWidth: 1
                        },
                        mode: "x"
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Date",
                        font: {
                            size: 16,
                            weight: "bold"
                        },
                        color: "#fff",
                        padding: 10
                    },
                    ticks: { color: "#fff" },
                    grid: { color: "rgba(255,255,255,0.1)" }
                },
                y: {
                    title: {
                        display: true,
                        text: data["currency"],
                        font: {
                            size: 16,
                            weight: "bold"
                        },
                        color: "#fff",
                        padding: 10
                    },
                    ticks: { color: "#fff" },
                    grid: { color: "rgba(255,255,255,0.1)" }
                }
            }
        }
    });
}
