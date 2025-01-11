import { useNavigate } from "react-router-dom";
import useIsMobile from "./useIsMobile";
const Pcard = ({ gains, stockname }) => {
  const isMobile =useIsMobile();
  const navigate=useNavigate();
  const gohandler=()=>{
    navigate(`/main/stockinfo/${stockname}`);
  }
    if (gains) {
      const stock = gains;
      const open = parseFloat(stock.buyPrice || 0);
      const close = parseFloat(stock.todayPrice || 0);
      const change = close - open;
      console.log(stock)
      return (
        <div>
        {isMobile?(
          <div className="flex flex-col mt-2 mb-4 border-b border-gray-700 pb-2">
          <div className="flex flex-row ">
          <button className={stockname.length===3?'text-lg font-semibold ml-4 mr-9':'text-lg font-semibold ml-4 mr-6'} onClick={gohandler}>{stockname}</button>
          <div className="text-lg font-base ml-4 mr-4">{open.toFixed(2)}</div>
          <div className="text-lg font-base ml-4 mr-4">{close.toFixed(2)}</div>
          <div className={change>=0 ? 'text-[#0ABB92] text-lg font-base ml-auto mr-auto': 'text-[#D55438] text-lg font-base ml-auto mr-auto'}>{change.toFixed(2)}%</div>
          </div>
          <div>
            <div className="text-sm font-base ml-4 mr-4">{stock.quantity} shares</div>
          </div>
          
         
        </div>
        ):(
          <div className="flex flex-col mt-2 mb-4">
          <div className="flex flex-row ">
          <div className="text-lg font-semibold ml-4 mr-16">{stockname}</div>
          <div className="text-lg font-base ml-28 mr-16">{open.toFixed(2)}</div>
          <div className="text-lg font-base ml-28 mr-16">{close.toFixed(2)}</div>
          <div className={change>=0 ? 'text-[#0ABB92] text-lg font-base ml-auto mr-auto': 'text-[#D55438] text-lg font-base ml-auto mr-auto'}>{change.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm font-base ml-4 mr-4">{stock.quantity} shares</div>
          </div>
          
         
        </div>
        )}

         </div>
        
      );
    } else {
      return <div>No stock data available.</div>;
    }
  };
  
  export default Pcard;
  