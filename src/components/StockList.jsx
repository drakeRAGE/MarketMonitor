// src/components/StockList.jsx

import React, { useState } from "react";

const predefinedStocks = [
  { symbol: "AAPL", description: "Apple Inc." },
  { symbol: "MSFT", description: "Microsoft Corporation" },
  { symbol: "GOOGL", description: "Alphabet Inc." },
  { symbol: "AMZN", description: "Amazon.com, Inc." },
  { symbol: "TSLA", description: "Tesla, Inc." },
  { symbol: "META", description: "Meta Platforms, Inc." },
  { symbol: "NVDA", description: "NVIDIA Corporation" },
  { symbol: "BRK.B", description: "Berkshire Hathaway Inc." },
  { symbol: "V", description: "Visa Inc." },
  { symbol: "JPM", description: "JPMorgan Chase & Co." },
  { symbol: "NFLX", description: "Netflix, Inc." },
  { symbol: "DIS", description: "The Walt Disney Company" },
  { symbol: "NKE", description: "Nike, Inc." },
  { symbol: "BA", description: "The Boeing Company" },
  { symbol: "KO", description: "The Coca-Cola Company" },
  { symbol: "PEP", description: "PepsiCo, Inc." },
  { symbol: "INTC", description: "Intel Corporation" },
  { symbol: "IBM", description: "International Business Machines Corporation" },
  { symbol: "ORCL", description: "Oracle Corporation" },
  { symbol: "PYPL", description: "PayPal Holdings, Inc." },
];

const StockList = ({ onStockSelect }) => {
  const [selectedSymbol, setSelectedSymbol] = useState("");

  const handleSelectChange = (e) => {
    const symbol = e.target.value;
    const selectedStock = predefinedStocks.find(
      (stock) => stock.symbol === symbol
    );
    setSelectedSymbol(symbol);
    onStockSelect(selectedStock);
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <select
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={selectedSymbol}
        onChange={handleSelectChange}
      >
        <option value="">Select a Stock</option>
        {predefinedStocks.map((stock) => (
          <option key={stock.symbol} value={stock.symbol}>
            {stock.symbol} - {stock.description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StockList;
