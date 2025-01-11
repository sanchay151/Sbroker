import axios from "axios";
import { useState, useEffect } from "react";

const LoseCards = ({ loses, onClick }) => {
  const [data, setData] = useState({});
  const compname = loses.symbol;

  useEffect(() => {
    const fetchData = async () => {
      try {
        var key1;
        var radnum=Math.floor(Math.random() * 3) + 1;
        if(radnum===1){
          key1="qe1euZUsQoZdqrjiPxFjR6Jtu8CEW9DO";
        }
        else if(radnum===2){
          key1="zzMVcCWf8wKgXF8fNJK7kT5Jez3nqeWm";
        }
        else{
          key1="uY5IFUnKaCzhL4rHPr5klsrOeMFxJx5p";
        }
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/profile/${compname}?apikey=${key1}`);
        setData(response.data[0]);
      } catch (error) {
        console.error('Error fetching overview data:', error);
      }
    };

    if (compname) {
      fetchData();
    }
  }, [compname]);

  return (
    <div onClick={onClick} className="w-40 h-auto hover:scale-125 bg-[#1B1B1B] rounded-lg p-4 flex flex-col justify-between text-white cursor-pointer transition-all hover:bg-[#333333] mr-2 ml-2">
      <div className="flex flex-col items-center">
        {data.image && (
          <img
            className="w-10 h-10 mb-2"
            src={data.image}
            alt="company logo"
          />
        )}
        <div className="text-center">
          <div className="text-sm font-bold mb-2">{loses.name}</div>
          <div className="text-lg font-bold mb-1">${loses.price}</div>
          <div className={`text-sm ${loses.changesPercentage < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {loses.changesPercentage}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoseCards;
