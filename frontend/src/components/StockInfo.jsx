import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import LineChart from './LineChart';
import Spner from './Spner';
import { setbuy } from '../redux/slices/PortStock';
import { setInvestment } from '../redux/slices/PortStock';
import { sell } from '../redux/slices/PortStock';
import Checkbox from './Checkbox';
import { FaArrowLeft } from "react-icons/fa";

import useIsMobile from './useIsMobile';
// Helper function to format numbers
const formatTwoDigits = (num) => {
  if (isNaN(num)) return num; // Return the value as is if it's not a number
  const numStr = num.toString();
  return numStr.length > 4 ? numStr.slice(0, 2) : numStr;
};

const StockInfo = () => {
  const isMobile=useIsMobile();
  const { stockName } = useParams();
  const [data, setData] = useState({});
  const [daily, setDaily] = useState({});
  const [opendaily, setopenDaily] = useState({});

  const [nowstock, setnowstock] = useState({});

  const [chartData, setChartData] = useState({ labels: [], data: [] });
  const [lineColor, setLineColor] = useState('green');
  const [activeTab, setActiveTab] = useState('BUY'); // Initialize action state
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const UserId = useSelector((state) => state.PortStock.UserId);
  const wallet=useSelector((state)=>state.PortStock.wallet);
  const authToken=localStorage.getItem("authToken");
  const stocksdata=useSelector((state)=>state.PortStock.stocks)
 
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        var key1;
        var radnum=Math.floor(Math.random() * 3) + 1;
        if(radnum===2){
             key1="gm8c0t1E93qi4EEEV8UcISfqfxsxikH2";
        }
        else{
           key1="gQ7ba4Lk6peogoo4ugS9Y1oY9XJ0OTeL";
        }
        const response = await axios.get(
          `https://financialmodelingprep.com/api/v3/profile/${stockName}?apikey=${key1}`
        );
        setData(response.data[0] || {});
      } catch (error) {
        console.error('Error fetching overview data:', error);
      }
    };

    const fetchDailyData = async () => {
      try {
        setLoading(true);

        const nowUTC = new Date();
        const nowET = new Date(nowUTC.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const getFormattedDate = (date) => {
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        };

        const yesterdayET = new Date(nowET);
        yesterdayET.setDate(nowET.getDate() - 1);
        const dayBeforeYesterdayET = new Date(nowET);
        dayBeforeYesterdayET.setDate(nowET.getDate() - 2);

        const fromDate = getFormattedDate(dayBeforeYesterdayET);
        const toDate = getFormattedDate(yesterdayET);
        var apiKey;
        var radnum=Math.floor(Math.random() * 3) + 1;
        if(radnum===2){
             apiKey="nHv2Hdgy6c1oNiOFECFk8oet4utBq9pp";
        }
        else{
           apiKey="gQ7ba4Lk6peogoo4ugS9Y1oY9XJ0OTeL";
        }
        const response = await axios.get(
          `https://financialmodelingprep.com/api/v3/historical-chart/5min/${stockName}?from=${fromDate}&to=${toDate}&apikey=${apiKey}`
        );

        let intradayData = response.data.slice(0, 100);
        if (intradayData.length > 78) {
          intradayData = intradayData.slice(0, 78);
        }
        const labels = intradayData.map((entry) => entry.date);
        const prices = intradayData.map((entry) => entry.close);

        const firstPrice = prices[prices.length - 1];
        const lastPrice = prices[0];

        setLineColor(lastPrice >= firstPrice ? 'rgba(10, 187, 146, 1)' : 'rgba(255, 99, 132, 1)');
        setChartData({ labels, data: prices });
        setDaily(intradayData[0]); // Set the latest data for display
        setopenDaily(intradayData[intradayData.length-1]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching intraday data:', error);
        setLoading(false);
      }
    };
    const StockDatathis= () =>{
      if(stocksdata){
        console.log("8");
        const thisstock=stocksdata.find((stock) => stock.ticker === stockName);
        setnowstock(thisstock);
      }
  };

    fetchOverview();
    fetchDailyData();
    StockDatathis();
  }, [stockName,stocksdata]);

  const buyHandler = async (e) => {
    console.log("idhar toh hai");
    const stockquantity = parseFloat(document.querySelector("input[type='number']").value);
    console.log("1");
    if (!stockquantity || stockquantity <= 0) {
      toast.error('Please enter a valid quantity!');
      return;
    }
  
    const totalCost = stockquantity * parseFloat(daily.close || 0);
  
    if (totalCost > wallet) {
      toast.error("Insufficient funds! Please check your wallet balance.");
      return;
    }
  
    try {
      const buyinfo= {
        stockticker:stockName,
        buyprice:daily.close,
        quantity:stockquantity,
        todayprice:daily.close
      }
      console.log("2");
      const response = await axios.post(`https://sbroker-backend.vercel.app/api/v1/stock/buystock/${UserId}`,buyinfo, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      });
      console.log("3");
      console.log(response);
      const userinfo=response.data;
      dispatch(setbuy(userinfo.user));
      const resStock=response.data.user.stocksHolding;
      console.log(resStock);
    
        const thisstock=resStock.find((stock) => stock.ticker === stockName);
        setnowstock(thisstock);
      
      


      console.log("4");
      try {
        const url = `https://sbroker-backend.vercel.app/api/v1/stock/totalprofit/${UserId}`;
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true, // Include cookies in the request
        });
        console.log(res);
        console.log("5");
        dispatch(setInvestment(res.data));
        console.log("6");
      } catch (error) {
        console.log(error);
      }
      
      toast.success(`Successfully purchased ${stockquantity} shares of ${stockName}!`);
    } catch (error) {
      console.log('Error buying stock:', error);
      toast.error("An error occurred while buying the stock. Please try again.");
    }
  };
  
  const sellHandler = async () => {
    const quantity = parseFloat(document.querySelector("input[type='number']").value);
    if(!nowstock){
      toast.error("You dont own this stock");
      return;
    }
    if (!quantity || quantity <= 0 || quantity>nowstock.quantity) {
      toast.error('Please enter a valid quantity!');
      return;
    }
    
  
    try {
      const sellinfo= {
        stockticker:stockName,
        sellprice:daily.close,
        quantity:quantity,
      }
      const response = await axios.post(`https://sbroker-backend.vercel.app/api/v1/stock/sellstock/${UserId}`,sellinfo, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      });
      const {user}=response.data;
      dispatch(sell(user));
      const resStock=response.data.user.stocksHolding;
      console.log(resStock);
    
        const thisstock=resStock.find((stock) => stock.ticker === stockName);
        setnowstock(thisstock);
      
     
      try {
        const url = `https://sbroker-backend.vercel.app/api/v1/stock/totalprofit/${UserId}`;
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true, // Include cookies in the request
        });
        console.log(res);
        dispatch(setInvestment(res.data));
      } catch (error) {
        console.log(error);
      }

      toast.success(`Successfully sold ${quantity} shares of ${stockName}!`);
    } catch (error) {
      console.error('Error selling stock:', error);
      toast.error("An error occurred while selling the stock. Please try again.");
    }
  };

  const close = parseFloat(opendaily.open || 0);
  const open = parseFloat(daily.close || 0);
  const change = close - open;
  const changePercent = open !== 0 ? (change / open) * 100 : 0;

  if (loading) {
    return (
      <div className="bg-[#121212] text-white h-screen w-screen flex items-center justify-center">
        <h2>Loading...</h2>
        <Spner />
      </div>
    );
  }

  return (
    <div >
      {isMobile?(<div className='flex flex-col'>
        <NavLink to="/main/" >
        <div className=' ml-4 mt-4'>
        <FaArrowLeft className='h-6 w-6'/>
          </div>
        </NavLink>
        <div className="flex flex-col">
          <div className='flex flex-row justify-between'>
          {data.image && (
        <img className="h-12 w-12 mt-4 ml-8" src={data.image} alt="company logo" />
      )}
           <div className=" mr-10 mt-8">
      <div
        className="flex flex-row rounded-lg shadow-lg h-[38px] w-[150px]"
        style={{ border: '1px solid #808080' }}
      >
        <Checkbox className="mt-4 pl-2" stockName={stockName} />
        <div className="pl-2 pr-2 text-sm font-semibold pt-2">Watchlist</div>
      </div>
    </div>
          </div>
      
      <div>
        <h1 className="mt-4 text-2xl font-semibold ml-4 mb-2 pt-4">{data.companyName}</h1>
        <h2 className="ml-4 text-lg font-base">{stockName}</h2>
      </div>
      <div className="flex flex-row gap-4 ml-4 mt-2">
        <div className="text-3xl font-base">${close.toFixed(2)}</div>
        <div className="flex flex-row gap-2 mt-1">
          <div
            className={`text-md mt-2 mb-3 font-semibold ${
              change < 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            ${change.toFixed(2)}
          </div>
          <div
            className={`text-md mt-2 mb-3 font-semibold ${
              change < 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            ({changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      <div className="h-max w-max">
          <LineChart chartData={chartData} lineColor={lineColor} />
        </div>
        <div
    className="max-w-md mx-4 bg-[#121212] text-white rounded-lg shadow-lg size-fit p-4 mt-6 mb-6"
    style={{ border: '1px solid #808080', textAlign: 'center' }}
  >
    <p className="text-base font-medium">{nowstock &&
    <div className='flex flex-col gap-2'>
      <div>{stockName} Holdings:</div>
      <div className='flex flex-row'> {nowstock.quantity} Shares</div>
      <div className='flex flex-row'> Average Price : ${nowstock.buyPrice.toFixed(2)} </div>
    
    
    </div>}
    {!nowstock && <div>
      You Don't Own This Stock </div>}</p>
  </div>

  
    </div>
    <div
      className="max-w-md mx-4 bg-[#121212] text-white rounded-lg shadow-lg p-6"
      style={{ border: "1px solid #808080" }}
    >
      {/* Tabs */}
      <div className="flex justify-between  border-b border-[#808080] mb-8">
        <button
          onClick={() => setActiveTab("BUY")}
          className={`flex-1 text-center text-lg font-bold py-2 transition-all duration-300 ${
            activeTab === "BUY"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setActiveTab("SELL")}
          className={`flex-1 text-center py-2 text-lg font-bold  transition-all duration-300 ${
            activeTab === "SELL"
              ? "text-red-400 border-b-2 border-red-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          SELL
        </button>
      </div>

     

      {/* Quantity and Price */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-base font-semibold text-gray-400 mb-1">Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            className="w-full bg-[#1e1e1e] text-white p-2 rounded border border-[#808080] focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="flex-1">
          <label className="block text-base font-semibold text-gray-400 mb-1">
            Price Market
          </label>
          <div className="w-full bg-[#1e1e1e] text-white font-semibold p-2 rounded border border-[#808080] flex items-center justify-center">
            {close.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Order Info */}
      <p className="text-gray-400 text-base mb-6">
        Order will be executed at best price in market
      </p>

      {/* Balance and Button */}
      <div className="flex justify-between items-center border-t border-[#808080] pt-4">
        <span className="text-gray-400 text-lg font-bold">Balance: ${wallet.toFixed(2)}</span>
      </div>
      <button
        onClick={activeTab==="BUY"?buyHandler:sellHandler}
        className={`w-full mt-4 py-2 rounded transition-all duration-300 ${
          activeTab === "BUY"
            ? "bg-[#0ABB92] hover:bg-green-600"
            : "bg-[#D55438] hover:bg-red-600"
        } text-white text-lg font-bold`}
      >
        
        {activeTab}
      </button>
    </div>
    <h2 className="text-xl font-semibold mt-4 ml-4 mb-4">Company Overview</h2>
<div className="text-md font-semibold ml-4 grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
  <div>Sector: {data.sector}</div>
  <div>Market Capitalisation: {formatTwoDigits(data.mktCap)}</div>
  <div>Industry: {data.industry}</div>
  <div>Volume: {data.volAvg}</div>
  <div>Beta: {formatTwoDigits(data.beta)}</div>
</div>

      </div>):(     <div>
  <div className="flex justify-between items-start">
    {/* Left Section: Company Info */}
    <div className="flex flex-row">
      {data.image && (
        <img className="h-24 w-24 mt-4 ml-4" src={data.image} alt="company logo" />
      )}
      <div>
        <h1 className="mt-4 text-2xl font-semibold ml-4 mb-2 pt-4">{data.companyName}</h1>
        <h2 className="ml-4 text-lg font-base">{stockName}</h2>
      </div>
      <div className="flex flex-row gap-4 ml-12 mt-12">
        <div className="text-3xl font-base">${close.toFixed(2)}</div>
        <div className="flex flex-row gap-2 mt-1">
          <div
            className={`text-md mt-2 mb-1 font-semibold ${
              change < 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            ${change.toFixed(2)}
          </div>
          <div
            className={`text-md mt-2 mb-1 font-semibold ${
              change < 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            ({changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      
    </div>

    {/* Right Section: Watchlist */}
    <div className="mr-[120px] mt-12">
      <div
        className="flex flex-row rounded-lg shadow-lg h-[38px] w-[150px]"
        style={{ border: '1px solid #808080' }}
      >
        <Checkbox className="mt-4 pl-2" stockName={stockName} />
        <div className="pl-2 pr-2 text-sm font-semibold pt-2">Watchlist</div>
      </div>
    </div>
  </div>
        
      <div className='flex flex-row '>
        <div className="h-max w-max">
          <LineChart chartData={chartData} lineColor={lineColor} />
        </div>

        <div>
        
        <div
      className="max-w-md mx-auto bg-[#121212] text-white rounded-lg shadow-lg p-6"
      style={{ border: "1px solid #808080" }}
    >
      {/* Tabs */}
      <div className="flex justify-between  border-b border-[#808080] mb-8">
        <button
          onClick={() => setActiveTab("BUY")}
          className={`flex-1 text-center text-lg font-bold py-2 transition-all duration-300 ${
            activeTab === "BUY"
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => setActiveTab("SELL")}
          className={`flex-1 text-center py-2 text-lg font-bold  transition-all duration-300 ${
            activeTab === "SELL"
              ? "text-red-400 border-b-2 border-red-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          SELL
        </button>
      </div>

     

      {/* Quantity and Price */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-base font-semibold text-gray-400 mb-1">Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            className="w-full bg-[#1e1e1e] text-white p-2 rounded border border-[#808080] focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="flex-1">
          <label className="block text-base font-semibold text-gray-400 mb-1">
            Price Market
          </label>
          <div className="w-full bg-[#1e1e1e] text-white font-semibold p-2 rounded border border-[#808080] flex items-center justify-center">
            {close.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Order Info */}
      <p className="text-gray-400 text-base mb-6">
        Order will be executed at best price in market
      </p>

      {/* Balance and Button */}
      <div className="flex justify-between items-center border-t border-[#808080] pt-4">
        <span className="text-gray-400 text-lg font-bold">Balance: ${wallet.toFixed(2)}</span>
      </div>
      <button
        onClick={activeTab==="BUY"?buyHandler:sellHandler}
        className={`w-full mt-4 py-2 rounded transition-all duration-300 ${
          activeTab === "BUY"
            ? "bg-[#0ABB92] hover:bg-green-600"
            : "bg-[#D55438] hover:bg-red-600"
        } text-white text-lg font-bold`}
      >
        
        {activeTab}
      </button>
    </div>
    </div>
        

        </div>
        <div
    className="max-w-md mx-4 bg-[#121212] text-white rounded-lg shadow-lg size-fit p-4 mt-6 mb-6"
    style={{ border: '1px solid #808080', textAlign: 'center' }}
  >
    <p className="text-base font-medium">{nowstock &&
    <div className='flex flex-col gap-2'>
      <div>{stockName} Holdings:</div>
      <div className='flex flex-row'> {nowstock.quantity} Shares</div>
      <div className='flex flex-row'> Average Price : ${nowstock.buyPrice.toFixed(2)} </div>
    
    
    </div>}
    {!nowstock && <div>
      You Don't Own This Stock </div>}</p>
  </div>
  <h2 className="text-xl font-semibold mt-4 ml-4 mb-4">Company Overview</h2>
<div className="text-md font-semibold ml-4 grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
  <div>Sector: {data.sector}</div>
  <div>Market Capitalisation: {formatTwoDigits(data.mktCap)}</div>
  <div>Industry: {data.industry}</div>
  <div>Volume: {data.volAvg}</div>
  <div>Beta: {formatTwoDigits(data.beta)}</div>
</div>

      </div>)}

    </div>
  );
};

export default StockInfo;
