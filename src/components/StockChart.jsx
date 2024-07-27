// src/components/StockChart.jsx

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const StockChart = ({ symbol }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const oneYearAgo = now - 365 * 24 * 60 * 60; // One year ago in seconds

      try {
        const response = await axios.get(
          `https://finnhub.io/api/v1/stock/candle`,
          {
            params: {
              symbol: symbol,
              resolution: "D", // Daily resolution
              from: oneYearAgo,
              to: now,
              token: "cqhqnd1r01qgbqu5ttggcqhqnd1r01qgbqu5tth0",
            },
          }
        );

        if (response.data.s === "ok") {
          const data = {
            labels: response.data.t.map((timestamp) =>
              new Date(timestamp * 1000).toLocaleDateString()
            ),
            datasets: [
              {
                label: `${symbol} Stock Price`,
                data: response.data.c,
                fill: false,
                borderColor: "rgba(75,192,192,1)",
                tension: 0.1,
              },
            ],
          };
          setChartData(data);
        } else {
          console.error("Error fetching chart data:", response.data);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [symbol]);

  if (!chartData) {
    return <p>Loading chart...</p>;
  }

  return (
    <div className="bg-white shadow rounded p-4 mt-4">
      <Line data={chartData} />
    </div>
  );
};

export default StockChart;
