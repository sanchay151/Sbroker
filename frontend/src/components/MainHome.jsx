import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import StockInfo from "./StockInfo";
import Portfolio from "./Portfolio";
import ProfileHome from "./ProfileHome";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout } from "../redux/slices/PortStock";
import { useEffect, useState } from "react";
import Spner from "./Spner";
import { setInvestment } from "../redux/slices/PortStock";
import { setGainers } from "../redux/slices/GainLose";
import { setLosers } from "../redux/slices/GainLose";
import { setwatchstock } from "../redux/slices/Watchlistdata";

const MainHome = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.PortStock.userlogin); // Check if user login is complete
  const [isFetching, setIsFetching] = useState(true); // Flag to control rendering
  var key1;
  var key2;
  var radnum=Math.floor(Math.random() * 3) + 1;
  if(radnum%3===0){
    key1="qe1euZUsQoZdqrjiPxFjR6Jtu8CEW9DO";
    key2="2mQTQ1DGGY5KeMvC5cRFxs7lbanhmuxc";
  }
  else{
    key1="Ysm6bq5hKjOVCSacbEh0FJP9WXAYVLe4";
    key2="VRvgOF3DRavs5xoGQzfpFdLUD8Wl3bgD"
  }
  
 
  
  var watchlist=useSelector((state)=>state.PortStock.watchlist);
    watchlist = watchlist ? watchlist.filter((stock) => stock !== "00") : [];
  useEffect(() => {
    const fetchGainers = async () => {
      try {
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${key1}`);
        dispatch(setGainers(response.data));
       //console.log(response);
      } catch (error) {
       // setError('Error fetching data. Please try again later.');
        console.error('Error fetching data:', error);
      }
    };

    const fetchLosers = async () => {
      try {
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${key2}`);
        dispatch(setLosers(response.data));
       // console.log(response.data);

      } catch (error) {
       // setError('Error fetching data. Please try again later.');
        console.error('Error fetching data:', error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchGainers(), fetchLosers()]);
    //  setLoading(false);
    };

   

    
      
    
    const fetchUserInfo = async () => {
      const authtoken = localStorage.getItem("authToken");
      console.log(authtoken);
      if (authtoken) {
        try {
          const url = "https://sbroker-backend.vercel.app/api/v1/profile/profileid";
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
            withCredentials: true, // Include cookies in the request
          });

          const userinfo = response.data;

          if (userinfo.success) {
            dispatch(setUser(userinfo.user));

            const userid=userinfo.user._id;
            
            try {
              const url = `https://sbroker-backend.vercel.app/api/v1/stock/totalprofit/${userid}`;
              const res = await axios.get(url, {
                headers: {
                  Authorization: `Bearer ${authtoken}`,
                },
                withCredentials: true, // Include cookies in the request
              });
              console.log(res);
              dispatch(setInvestment(res.data));
              
            } catch (error) {
              console.log(error);
            }
          } else {
            throw new Error("Failed to fetch user info");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }

      setIsFetching(false); // Mark the fetching process as complete
    };

    fetchUserInfo();
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(()=>{
    const fetchWatchlistData = async () => {
      try {

        const promises = watchlist.map(async (stockName) => {
          const response = await axios.get(
            `https://financialmodelingprep.com/api/v3/historical-price-full/${stockName}?apikey=tnlXNbPYj1ustnSJ7lcFwRfI2rQy6INv`
          );
          console.log(response);
          return response;
        });

        const results = await Promise.all(promises); // Wait for all API calls to finish
        const watchdata=results.filter((data) => data); // Filter out invalid data
        console.log(watchdata);
        dispatch(setwatchstock(watchdata));
      //  console.log(stockData);
      } catch (error) {
        console.error('Error fetching watchlist data:', error);
      }
    };
    fetchWatchlistData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[watchlist])
  // Check if data is still being fetched or user is not logged in
  if (isFetching || !userLogin) {
    return (
      <div className="bg-[#121212] text-white h-screen w-screen flex items-center justify-center">
        <h2>Loading...</h2>
        <Spner/>
      </div>
    );
  }

  // Render the main content after user data is fully loaded into Redux
  return (
    <div className="bg-[#121212] text-white h-screen w-screen overflow-x-hidden">
      <div>
        <Navbar />
      </div>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="stockinfo/:stockName" element={<StockInfo />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="profile" element={<ProfileHome />} />
      </Routes>
    </div>
  );
};

export default MainHome;
