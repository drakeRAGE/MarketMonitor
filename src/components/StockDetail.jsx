// src/components/StockDetail.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

const StockDetail = ({ stock }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${stock.symbol}&token=cqhqnd1r01qgbqu5ttggcqhqnd1r01qgbqu5tth0`
        );
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching stock details:", error);
      }
    };

    fetchStockDetails();
  }, [stock]);

  if (!details) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-white shadow rounded p-4 mt-4">
      <h2 className="text-xl font-bold mb-2">{stock.description}</h2>
      <p>Current Price: ${details.c.toFixed(2)}</p>
      <p>High Price: ${details.h.toFixed(2)}</p>
      <p>Low Price: ${details.l.toFixed(2)}</p>
      <p>Open Price: ${details.o.toFixed(2)}</p>
      <p>Previous Close: ${details.pc.toFixed(2)}</p>
    </div>
  );
};

export default StockDetail;
