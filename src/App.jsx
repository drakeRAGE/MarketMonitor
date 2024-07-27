import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "tailwindcss/tailwind.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

// Register the necessary components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [stockData, setStockData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [symbol, setSymbol] = useState("AAPL");
  const [highest, setHighest] = useState(null);
  const [lowest, setLowest] = useState(null);
  const [average, setAverage] = useState(null);
  const [volume, setVolume] = useState(null);
  const [detailedData, setDetailedData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("1month");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [topCompanies, setTopCompanies] = useState([
    { name: "Apple Inc.", symbol: "AAPL", price: 175.12, change: 2.34 },
    { name: "Microsoft Corp.", symbol: "MSFT", price: 344.67, change: -1.12 },
    { name: "Google LLC", symbol: "GOOGL", price: 2784.29, change: 15.45 },
    { name: "Amazon.com Inc.", symbol: "AMZN", price: 133.57, change: -0.76 },
    { name: "Tesla Inc.", symbol: "TSLA", price: 890.24, change: 5.67 },
    { name: "Meta Platforms Inc.", symbol: "META", price: 300.45, change: 1.12 },
    { name: "NVIDIA Corporation", symbol: "NVDA", price: 462.87, change: 7.45 },
    { name: "Intel Corporation", symbol: "INTC", price: 34.89, change: -0.56 },
    { name: "Adobe Inc.", symbol: "ADBE", price: 591.21, change: 8.34 },
    { name: "Oracle Corporation", symbol: "ORCL", price: 120.45, change: 3.21 },
    { name: "Salesforce Inc.", symbol: "CRM", price: 220.12, change: -2.11 },
    { name: "Netflix Inc.", symbol: "NFLX", price: 444.56, change: 6.45 },
  ]);
  const [numberOfShares, setNumberOfShares] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const apiKey = "BN78SqAcIKUFKurda2pZ3ZoMIAUBJCFS";

  useEffect(() => {
    fetchStockData();
  }, [dateRange, symbol]);

  const getDateRange = () => {
    const currentDate = new Date();
    let fromDate = new Date();

    switch (dateRange) {
      case "5days":
        fromDate.setDate(currentDate.getDate() - 5);
        break;
      case "15days":
        fromDate.setDate(currentDate.getDate() - 15);
        break;
      case "1month":
        fromDate.setMonth(currentDate.getMonth() - 1);
        break;
      case "6months":
        fromDate.setMonth(currentDate.getMonth() - 6);
        break;
      case "1year":
        fromDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      default:
        fromDate.setMonth(currentDate.getMonth() - 1);
        break;
    }

    const toDate = currentDate.toISOString().split("T")[0];
    const fromDateString = fromDate.toISOString().split("T")[0];
    return { fromDateString, toDate };
  };

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const { fromDateString, toDate } = getDateRange();

      const response = await axios.get(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${fromDateString}/${toDate}?adjusted=true&sort=asc&apiKey=${apiKey}`
      );
      const data = response.data.results;

      const chartLabels = data.map((point) =>
        new Date(point.t).toLocaleDateString()
      );
      const chartDataPoints = data.map((point) => point.c);
      const volumes = data.map((point) => point.v);

      const highestPrice = Math.max(...chartDataPoints);
      const lowestPrice = Math.min(...chartDataPoints);
      const averagePrice = (
        chartDataPoints.reduce((acc, price) => acc + price, 0) /
        chartDataPoints.length
      ).toFixed(2);
      const totalVolume = volumes.reduce((acc, vol) => acc + vol, 0);

      // Get the current price and calculate the price change
      const latestPrice = chartDataPoints[chartDataPoints.length - 1];
      const previousPrice = chartDataPoints[chartDataPoints.length - 2];
      const change = (latestPrice - previousPrice).toFixed(2);
      const changePercentage = (
        ((latestPrice - previousPrice) / previousPrice) *
        100
      ).toFixed(2);

      setCurrentPrice(latestPrice);
      setPriceChange({ change, changePercentage });

      const chartData = {
        labels: chartLabels,
        datasets: [
          {
            label: `Stock Price of ${symbol}`,
            data: chartDataPoints,
            fill: false,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
          },
        ],
      };

      const detailedData = data.map((point) => ({
        date: new Date(point.t).toLocaleDateString(),
        open: point.o,
        close: point.c,
        high: point.h,
        low: point.l,
        volume: point.v,
      }));

      setStockData(chartDataPoints);
      setChartData(chartData);
      setHighest(highestPrice);
      setLowest(lowestPrice);
      setAverage(averagePrice);
      setVolume(totalVolume);
      setDetailedData(detailedData);
    } catch (error) {
      console.error("Error fetching the stock data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchStockData();
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleSharesChange = (event) => {
    const shares = parseFloat(event.target.value) || 0;
    setNumberOfShares(shares);
    setTotalValue(currentPrice ? (shares * currentPrice).toFixed(2) : 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 flex flex-col md:flex-row items-start p-6">
      <div className="flex-1">
        <h1 className="text-4xl font-extrabold text-center my-6 text-gray-900">
          MarketMonitor
        </h1>

        {/* Current Price and Change Display */}
        {currentPrice !== null && priceChange !== null && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 w-full max-w-lg flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-xl font-bold text-gray-800 mr-2">
                Current Price:
              </p>
              <p className="text-3xl font-extrabold text-green-600">
                ${currentPrice}
              </p>
            </div>
            <div className="flex items-center">
              {priceChange.change > 0 ? (
                <FaArrowUp className="text-green-500" />
              ) : (
                <FaArrowDown className="text-red-500" />
              )}
              <span
                className={`ml-2 ${
                  priceChange.change > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {priceChange.change} ({priceChange.changePercentage}%)
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center mb-6">
          <label htmlFor="stockSymbol" className="text-gray-700 mr-4">
            Stock Symbol:
          </label>
          <input
            type="text"
            id="stockSymbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={fetchStockData}
            className="p-3 bg-indigo-500 text-white ml-2 rounded-md shadow-sm hover:bg-indigo-600 transition"
          >
            Fetch Data
          </button>
        </div>

        <div className="flex items-center mb-6">
          <label htmlFor="dateRange" className="text-gray-700 mr-4">
            Date Range:
          </label>
          <select
            id="dateRange"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="p-3 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="5days">Last 5 Days</option>
            <option value="15days">Last 15 Days</option>
            <option value="1month">Last 1 Month</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last 1 Year</option>
          </select>
        </div>

        {loading && <p className="text-center text-gray-700">Loading...</p>}

        {!loading && chartData.labels && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <Line data={chartData} />
          </div>
        )}

        <button
          onClick={toggleDetails}
          className="w-full max-w-lg p-3 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600 transition"
        >
          {showDetails ? "Hide" : "Show"} Detailed Data
        </button>

        {showDetails && (
          <div className="bg-white rounded-lg shadow-md p-4 mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left text-gray-600">Date</th>
                  <th className="py-2 px-4 text-left text-gray-600">Open</th>
                  <th className="py-2 px-4 text-left text-gray-600">Close</th>
                  <th className="py-2 px-4 text-left text-gray-600">High</th>
                  <th className="py-2 px-4 text-left text-gray-600">Low</th>
                  <th className="py-2 px-4 text-left text-gray-600">Volume</th>
                </tr>
              </thead>
              <tbody>
                {detailedData.map((data, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4">{data.date}</td>
                    <td className="py-2 px-4">{data.open}</td>
                    <td className="py-2 px-4">{data.close}</td>
                    <td className="py-2 px-4">{data.high}</td>
                    <td className="py-2 px-4">{data.low}</td>
                    <td className="py-2 px-4">{data.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        
      </div>

      <div className="w-full md:w-1/3 mt-20 bg-white rounded-lg shadow-md p-4 ml-6 flex flex-col space-y-6">
        {/* Current Stock Information */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Stock Information</h2>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Highest Price:</span>
              <span className="font-semibold text-gray-800">
                ${highest !== null ? highest.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Lowest Price:</span>
              <span className="font-semibold text-gray-800">
                ${lowest !== null ? lowest.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Average Price:</span>
              <span className="font-semibold text-gray-800">
                ${average !== null ? average : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Total Volume:</span>
              <span className="font-semibold text-gray-800">
                {volume !== null ? volume.toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Companies</h2>
          <ul>
            {topCompanies.map((company) => (
              <li
                key={company.symbol}
                className={`flex items-center justify-between py-2 border-b border-gray-200 ${
                  company.symbol === symbol ? "bg-indigo-100 text-indigo-800 font-semibold" : "text-gray-800"
                }`}
                onClick={() => {
                  setSymbol(company.symbol);
                  fetchStockData();
                }}
              >
                <span>{company.name}</span>
                <div className="flex items-center">
                  <span className="text-gray-600">${company.price.toFixed(2)}</span>
                  {company.change > 0 ? (
                    <FaArrowUp className="text-green-500 ml-2" />
                  ) : (
                    <FaArrowDown className="text-red-500 ml-2" />
                  )}
                  <span className={`ml-1 ${company.change > 0 ? "text-green-500" : "text-red-500"}`}>
                    {company.change.toFixed(2)} ({((company.change / company.price) * 100).toFixed(2)}%)
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Shares Value Calculation */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Shares Value Calculator
          </h2>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Number of Shares:</span>
              <input
                type="number"
                value={numberOfShares}
                onChange={handleSharesChange}
                min="0"
                className="p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Total Value:</span>
              <span className="font-semibold text-gray-800">
                ${totalValue}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
