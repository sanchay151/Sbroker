import React from 'react';
import { useSelector } from 'react-redux';
import Pcard from './PCard'
import { MdAddChart } from "react-icons/md";
const Portfolio = () => {
  const stocks = useSelector((state) => state.PortStock.stocks);
  const invested = useSelector((state) => state.PortStock.invested);
  const portfolioNow = useSelector((state) => state.PortStock.portfolionow);

  const totalReturns = portfolioNow - invested;
  let totalReturnsPercentage = ((totalReturns / invested) * 100).toFixed(2);
  if(totalReturns===0){
    totalReturnsPercentage=0;
  }

  return (
    <div>
      <div className='w-200px border border-[#2E2E2E] rounded-md mr-96 ml-3 mt-4'>
      <div className='h-24 w-auto bg-[#10362D] flex flex-row '>
        <div className='flex flex-col ml-4 mt-6 '>
          <div className='text-3xl font-semibold ml-6'>${portfolioNow.toFixed(0)}</div>
          <div className='text-sm font-medium mt-1'>Current Amount</div>
        </div>
        <div className='ml-20 flex flex-col justify-evenly'>
          <div className='flex flex-row gap-2 mt-2'>
            <div className='text-base font-medium'>Invested Value:</div>
            <div className='font-medium'>${(invested-0).toFixed(2)}</div>
          </div>
          <div className='flex flex-row gap-2'>
            <div className='text-base font-medium'>Total Returns:</div>
            <div className={totalReturns>=0 ? 'font-medium text-[#0BA17F]' : 'font-medium text-[#D55438]' }>${totalReturns.toFixed(2)} ({(totalReturnsPercentage-0).toFixed(2)}%)</div>
          </div>
        </div>
      </div>
      <div>
        <div className='flex flex-row '>
          <div className='ml-4 mr-8 font-medium text-lg'>Stock</div>
          <div className='ml-32 mr-8 font-medium text-lg'>Invested</div>
          <div className='ml-32 mr-8 font-medium text-lg'>Current</div>
          <div className='ml-28 mr-2 font-medium text-lg'>Change</div>
        </div>
        {stocks.length > 0 ? (
          stocks.map((stock, index) => (
            <Pcard key={stock.vwap} gains={stock} stockname={stock["symbol"]} />
          ))
        ) : (
          <div className='flex flex-col gap-4 items-center'>
             <p className='mt-8  mr-2 text-xl font-semibold'>ADD STOCKS TO YOUR PORTFOLIO</p>
             <MdAddChart className='' size={36}/>
            </div>
          
        )}
      </div>
      </div>
      
    </div>
  );
};

export default Portfolio;
