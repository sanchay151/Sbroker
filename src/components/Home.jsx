import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PortfolioCard from './PortfolioCard';
import HomeCards from './HomeCards';
import LoseCards from './LoseCards';
import { NavLink, useNavigate } from 'react-router-dom';
import Spner from './Spner';

const Home = () => {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
//  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGainers = async () => {
      try {
        const response = await axios.get('https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=qe1euZUsQoZdqrjiPxFjR6Jtu8CEW9DO');
        setGainers(response.data);
      } catch (error) {
       // setError('Error fetching data. Please try again later.');
        console.error('Error fetching data:', error);
      }
    };

    const fetchLosers = async () => {
      try {
        const response = await axios.get('https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=qe1euZUsQoZdqrjiPxFjR6Jtu8CEW9DO');
        setLosers(response.data);
      } catch (error) {
       // setError('Error fetching data. Please try again later.');
        console.error('Error fetching data:', error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchGainers(), fetchLosers()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCardClick = (stockName) => {
    navigate(`/stockinfo/${stockName}`);
  };

  if (loading) {
    return <Spner />;
  }

  return (
    
    <div className='flex flex-row '>
      <div className='flex flex-col ml-16'>
        <h1 id='nasdaq' className='text-3xl text-white font-bold mt-5'>NASDAQ100</h1>
        <div className='flex flex-col'>
          <h2 className='text-xl text-white font-semibold mt-3 mb-3'>TOP GAINERS</h2>
          <div className='flex flex-row'>
            {gainers.length > 0 ? (
              gainers.slice(0, 4).map((gain) => (
                <HomeCards onClick={() => handleCardClick(gain.symbol)} key={gain.symbol} gains={gain} />
              ))
            ) : (
              <p>Data not available</p>
            )}
          </div>
        </div>
        <div>
          <h2 className='text-xl text-white font-semibold mt-3 mb-3'>TOP LOSERS</h2>
          <div className='flex flex-row '>
            {losers.length > 0 ? (
              losers.slice(0, 4).map((lose) => (
                <LoseCards onClick={() => handleCardClick(lose.symbol)} key={lose.symbol} loses={lose} />
              ))
            ) : (
              <p>Data not available</p>
            )}
          </div>
        </div>
      </div>
      
        <div className='flex flex-col mt-8 w-auto ml-28'>
          <div className='flex flex-row gap-16'>
          <NavLink to="/Portfolio"> 
          <div
          className='text-xl font-semibold mb-2 '
          >Your Investments</div>
          </NavLink>
          <NavLink to="/Portfolio">  
          <div className='text-[#0ABB92] text-sm font-semibold mt-2'>Dashboard</div>
          </NavLink>
          </div>
          <NavLink to="/Portfolio"> 
          <PortfolioCard />
          </NavLink>
        </div>
      
      
      
    </div>
  );
};

export default Home;
