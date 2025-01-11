import React from 'react';
import { useSelector } from 'react-redux';
import Pcard from './PCard'
import { MdAddChart } from "react-icons/md";
import useIsMobile from './useIsMobile';
const Portfolio = () => {
  const isMobile=useIsMobile();
  const stocks = useSelector((state) => state.PortStock.stocks);
  const invested = useSelector((state) => state.PortStock.invested);
  const profitNow = useSelector((state) => state.PortStock.profit);

  const totalReturns = profitNow;
  

  return (
    <div>
      {isMobile?(
        <div className='w-[385px] border border-[#2E2E2E] rounded-md mr-8 ml-3 mt-4'>
        <div className='h-24 w-auto bg-[#10362D] flex flex-row '>
          <div className='flex flex-col ml-4 mt-6 '>
            <div className='text-xl font-semibold ml-6'>${profitNow.toFixed(0)}</div>
            <div className='text-lg font-semibold mt-1 ml-6'>Profit</div>
          </div>
          <div className='ml-20 flex flex-col justify-evenly'>
            <div className='flex flex-row gap-2 mt-2'>
              <div className='text-base font-medium'>Invested Value:</div>
              <div className='font-medium'>${(invested-0).toFixed(2)}</div>
            </div>
            <div className='flex flex-row gap-2'>
              <div className='text-base font-medium'>Total Returns:</div>
              <div className={totalReturns>=0 ? 'font-medium text-[#0BA17F]' : 'font-medium text-[#D55438]' }>${totalReturns.toFixed(2)} </div>
            </div>
          </div>
        </div>
        <div>
          <div className='flex flex-row '>
            <div className='ml-4 mr-4 font-medium text-base'>Stock</div>
            <div className='ml-4 mr-4 font-medium text-base'>Invested</div>
            <div className='ml-4 mr-4 font-medium text-base'>Current</div>
            <div className='ml-4 mr-2 font-medium text-base'>Change</div>
          </div>
          {stocks.length > 0 ? (
            stocks.map((stock, index) => (
              <Pcard key={stock._id} gains={stock} stockname={stock.ticker} />
            ))
          ) : (
            <div className='flex flex-col gap-4 items-center'>
               <p className='mt-8  mr-2 text-xl font-semibold'>ADD STOCKS TO YOUR PORTFOLIO</p>
               <MdAddChart className='' size={36}/>
              </div>
            
          )}
        </div>
        </div>
      ):( <div className='w-200px border border-[#2E2E2E] rounded-md mr-96 ml-3 mt-4'>
      <div className='h-24 w-auto bg-[#10362D] flex flex-row '>
        <div className='flex flex-col ml-4 mt-6 '>
          <div className='text-3xl font-semibold ml-6'>${profitNow.toFixed(0)}</div>
          <div className='text-lg font-semibold mt-1 ml-12'>Profit</div>
        </div>
        <div className='ml-20 flex flex-col justify-evenly'>
          <div className='flex flex-row gap-2 mt-2'>
            <div className='text-base font-medium'>Invested Value:</div>
            <div className='font-medium'>${(invested-0).toFixed(2)}</div>
          </div>
          <div className='flex flex-row gap-2'>
            <div className='text-base font-medium'>Total Returns:</div>
            <div className={totalReturns>=0 ? 'font-medium text-[#0BA17F]' : 'font-medium text-[#D55438]' }>${totalReturns.toFixed(2)} </div>
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
            <Pcard key={stock._id} gains={stock} stockname={stock.ticker} />
          ))
        ) : (
          <div className='flex flex-col gap-4 items-center'>
             <p className='mt-8  mr-2 text-xl font-semibold'>ADD STOCKS TO YOUR PORTFOLIO</p>
             <MdAddChart className='' size={36}/>
            </div>
          
        )}
      </div>
      </div>)}
     
      
    </div>
  );
};

export default Portfolio;
