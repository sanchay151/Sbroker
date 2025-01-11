import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const WatchlistStocks = () => {
  const navigate=useNavigate();
  const stockData=useSelector((state)=>state.Watchlistdata.watchstock)

 
  const watchclick = (element) => {
    navigate(`/main/stockinfo/${element}`);
  };


  if (stockData.length === 0) {
    return (
      <div className="flex pt-8 items-center">
        <h2>No stocks in your watchlist</h2>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-[300px] w-full bg-#121212 text-white p-4 border-2 border-[#2E2E2E] gap-6 rounded-md">
      {console.log(stockData)}
      {stockData.map((stock, index) => {
        const close = parseFloat(stock.data.historical[0].close);
        const open = parseFloat(stock.data.historical[0].open);
        const change = close - open;
        const changesPercentage = open !== 0 ? (change / open) * 100 : 0;

        return (
          <div
            key={index}
            className="flex justify-between items-center border-b border-gray-700 py-4"
          >
            <button className="text-lg font-semibold" onClick={()=>watchclick(stock.data.symbol)}>{stock.data.symbol}</button>
            <div className="text-right">
              <div className="text-xl">{`₹${close.toFixed(2)}`}</div>
              <div
                className={`text-sm ${
                  changesPercentage < 0 ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {`${change.toFixed(2)} (${changesPercentage.toFixed(2)}%)`}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WatchlistStocks;
