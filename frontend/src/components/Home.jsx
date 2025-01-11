import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Watchlist from "./Watchlist";
import PortfolioCard from "./PortfolioCard";
import HomeCards from "./HomeCards";
import LoseCards from "./LoseCards";
import useIsMobile from "./useIsMobile";
import Portfolio from "./Portfolio";
const Home = () => {
  const isMobile = useIsMobile();
  const [curstate, setcurstate] = useState("home");
  const navigate = useNavigate();
  const { GainStock, LoseStock } = useSelector((state) => state.GainLose);
  const gainers = GainStock;
  const losers = LoseStock;

  const handleCardClick = (stockName) => {
    navigate(`/main/stockinfo/${stockName}`);
  };

  const handleExploreClick = () => setcurstate("home");
  const handlePortfolioClick = () => setcurstate("portfolio");

  return (
    <div className="flex flex-col">
      {isMobile ? (
        <>
          {/* Navigation Buttons */}
          <div className="flex justify-center gap-6 my-4">
            {/* Explore Button */}
            <div
              className={`rounded-full px-6 py-2 border-2 border-[#555555] text-center cursor-pointer ${
                curstate === "home" ? "bg-[#333333]  text-white" : "bg-[#121212] text-white"
              }`}
              onClick={handleExploreClick}
            >
              Explore
            </div>
            {/* Portfolio Button */}
            <div
              className={`rounded-full px-6 py-2 border-2 border-[#555555] text-center cursor-pointer ${
                curstate === "portfolio" ? "bg-[#333333]   text-white" : "bg-[#121212] text-white"
              }`}
              onClick={handlePortfolioClick}
            >
              Portfolio
            </div>
          </div>

          {/* Content Based on Current State */}
          {curstate === "home" ? (
            <div className="flex flex-col">
              <div className="flex flex-col ml-10">
                <h1 id="nasdaq" className="text-4xl text-white font-bold mt-5">
                  NASDAQ100
                </h1>

                {/* Gainers Section */}
                <div className="flex flex-col">
                  <h2 className="text-xl text-white font-semibold mt-3 mb-3">
                    TOP WEEKLY GAINERS
                  </h2>
                  <div className="flex flex-row">
                    {gainers.length > 0 ? (
                      gainers.slice(0, 2).map((gain) => (
                        <HomeCards
                          onClick={() => handleCardClick(gain.symbol)}
                          key={gain.symbol}
                          gains={gain}
                        />
                      ))
                    ) : (
                      <p>Data not available</p>
                    )}
                  </div>
                </div>

                {/* Losers Section */}
                <div>
                  <h2 className="text-xl text-white font-semibold mt-3 mb-3">
                    TOP WEEKLY LOSERS
                  </h2>
                  <div className="flex flex-row">
                    {losers.length > 0 ? (
                      losers.slice(0, 2).map((lose) => (
                        <LoseCards
                          onClick={() => handleCardClick(lose.symbol)}
                          key={lose.symbol}
                          loses={lose}
                        />
                      ))
                    ) : (
                      <p>Data not available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Portfolio and Watchlist Section */}
              <div className="flex flex-col mb-8">
                

                <div className="flex flex-col mt-12 ml-12 mr-12">
                  <div className="text-2xl font-semibold mb-2">Your Watchlist</div>
                  <Watchlist />
                </div>
              </div>
            </div>
          ) : (
            // Placeholder for Portfolio State
            <div className="">
              <Portfolio/>
            </div>
          )}
        </>
      ) : (
        <div> <div className="flex flex-row">
        <div className="flex flex-col ml-16">
          <h1 id="nasdaq" className="text-3xl text-white font-bold mt-5">
            NASDAQ100
          </h1>

          {/* Gainers Section */}
          <div className="flex flex-col">
            <h2 className="text-xl text-white font-semibold mt-3 mb-3">
              TOP WEEKLY GAINERS
            </h2>
            <div className="flex flex-row">
              {gainers.length > 0 ? (
                gainers.slice(0, 4).map((gain) => (
                  <HomeCards
                    onClick={() => handleCardClick(gain.symbol)}
                    key={gain.symbol}
                    gains={gain}
                  />
                ))
              ) : (
                <p>Data not available</p>
              )}
            </div>
          </div>

          {/* Losers Section */}
          <div>
            <h2 className="text-xl text-white font-semibold mt-3 mb-3">
              TOP WEEKLY LOSERS
            </h2>
            <div className="flex flex-row">
              {losers.length > 0 ? (
                losers.slice(0, 4).map((lose) => (
                  <LoseCards
                    onClick={() => handleCardClick(lose.symbol)}
                    key={lose.symbol}
                    loses={lose}
                  />
                ))
              ) : (
                <p>Data not available</p>
              )}
            </div>
          </div>
          
        </div>

        {/* Portfolio and Watchlist Section */}
        <div className="flex flex-col">
          <div className="flex flex-col mt-8 w-auto ml-28">
            <div className="flex flex-row gap-16">
              <NavLink to="/main/Portfolio">
                <div className="text-2xl font-semibold mb-2">
                  Your Investments
                </div>
              </NavLink>
              <NavLink to="/main/Portfolio">
                <div className="text-[#0ABB92] text-sm font-semibold mt-2">
                  Dashboard
                </div>
              </NavLink>
            </div>
            <NavLink to="/main/Portfolio">
              <PortfolioCard />
            </NavLink>
          </div>

          <div className="flex flex-col mt-12 ml-28">
            <div className="text-2xl font-semibold mb-2">Your Watchlist</div>
            <Watchlist />
          </div>
        </div>
      </div></div>
      )}
    </div>
  );
};

export default Home;
