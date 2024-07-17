import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { buy, sell } from '../redux/slices/PortStock';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const formatTwoDigits = (num) => {
  if (isNaN(num)) return num; // Return the value as is if it's not a number
  const numStr = num.toString();
  if (numStr.length > 4) {
    return numStr.slice(0, 2); // Show only the first two digits for numbers longer than 4 digits
  }
  return numStr;
};

const StockInfo = () => {
  const { stockName } = useParams();
  const [data, setData] = useState({});
  const [daily, setDaily] = useState({});
  const dispatch = useDispatch();
  const sts = useSelector((state) => state.PortStock.stocks);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/profile/${stockName}?apikey=gQ7ba4Lk6peogoo4ugS9Y1oY9XJ0OTeL`);
        setData(response.data[0] || {});
      } catch (error) {
        console.error('Error fetching overview data:', error);
      }
    };

    const fetchDailyData = async () => {
      try {
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${stockName}?apikey=gQ7ba4Lk6peogoo4ugS9Y1oY9XJ0OTeL`);
        if (response.data && response.data.historical && response.data.historical.length > 0) {
          const dailyData = response.data.historical[0];
          setDaily({
            ...dailyData,
            symbol: stockName // Add the symbol property
          });
        }
      } catch (error) {
        console.error('Error fetching daily data:', error);
      }
    };

    fetchOverview();
    fetchDailyData();
  }, [stockName]);

  const buyHandler = () => {
    const isPresent = sts.some(stock => stock.symbol === daily.symbol);
    if (!isPresent) {
      dispatch(buy(daily));
      toast.success("Stock Bought");
    } else {
      toast.error("Stock already in portfolio");
    }
  };

  const sellHandler = () => {
    const isPresent = sts.some(stock => stock.symbol === daily.symbol);
    if (isPresent) {
      dispatch(sell(daily));
      toast.success("Stock Sold");
    } else {
      toast.error("Stock not in portfolio");
    }
  };

  const open = parseFloat(daily.open || 0);
  const close = parseFloat(daily.close || 0);
  const change = close - open;
  const changePercent = open !== 0 ? (change / open) * 100 : 0;

  return (
    <div>
      {data.image && <div><img
       className='h-28 w-28 mt-4 ml-4'
       src={data.image} alt="company logo" /></div>}
       <div className='flex flex-row'>
        <div >
        <h1 className='mt-4 text-2xl font-semibold ml-4 mb-2'>{data.companyName}</h1>
        <h2 className='ml-4 text-lg font-base '>{stockName}</h2>
        </div>
        <div className='flex flex-row gap-4 ml-12 mt-12 '>
        <div className='text-3xl font-base '>${close.toFixed(2)}</div>
        <div className='flex flex-row gap-2 mt-1'>
        <div className={change>=0 ? 'text-md mt-2 mb-1 font-semibold text-[#0ABB92]':'text-md font-semibold mt-2 mb-1 text-[#0ABB92]'}>${change.toFixed(2)}</div>
        <div className={change>=0 ? 'text-md mt-2 mb-1 font-semibold text-[#0ABB92]':'text-md font-semibold mt-2 mb-1 text-[#0ABB92]'}>   {"("}{changePercent.toFixed(2)}%{")"}</div>
        </div>
       
       </div>
      
       
      </div>
      <div>
        <button className='text-white bg-gradient-to-r from-[#0ABB92] to-[#0BAB86]
             hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-600 
             dark:focus:ring-green-800 font-medium rounded-lg text-sm px-3 py-2 text-center 
             mt-2 ml-8 me-2 mb-2 h-8 w-16' onClick={buyHandler}>BUY</button>
        <button className='text-white bg-gradient-to-r from-[#0ABB92] to-[#0BAB86]
             hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-600 
             dark:focus:ring-green-800 font-medium rounded-lg text-sm px-3 py-2 text-center 
             mt-2 ml-8 me-2 mb-2 h-8 w-16' onClick={sellHandler}>SELL</button>
      </div>
      <h2 className='text-xl font-semibold mt-4 ml-4 mb-4'>Company Overview</h2>
      <div>
        <div className='text-md font-semibold ml-4 flex flex-col gap-2'>
          <div>Sector: {data.sector}</div>
          <div>Market Capitalisation: {formatTwoDigits(data.mktCap)}</div>
          <div>Industry: {data.industry}</div>
        </div>
        <div className='text-md font-semibold ml-4 flex flex-col gap-2'>
          <div>Volume: {data.volAvg}</div>
          <div>Market Cap: {formatTwoDigits(data.mktCap)}Billions</div>
          <div>Beta: {formatTwoDigits(data.beta)}</div>
        </div>
      </div>

    </div>
  );
};

export default StockInfo;
