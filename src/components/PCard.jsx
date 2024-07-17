import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sell } from "../redux/slices/PortStock";
const Pcard = ({ gains, stockname }) => {
  const sts = useSelector((state) => state.PortStock.stocks);
  const dispatch = useDispatch();
    if (gains) {
      const sellHandler = () => {
        const isPresent = sts.some(stock => stock.symbol === gains.symbol);
        if (isPresent) {
          dispatch(sell(gains));
          toast.success("Stock Sold");
        } else {
          toast.error("Stock not in portfolio");
        }
      };
      const stock = gains;
      const open = parseFloat(stock.open || 0);
      const close = parseFloat(stock.close || 0);
      const change = close - open;
      console.log(stock)
      return (
        <div className="flex flex-col mt-2 mb-4">
          <div className="flex flex-row ">
          <div className="text-lg font-semibold ml-4 mr-16">{stockname}</div>
          <div className="text-lg font-base ml-28 mr-16">{open.toFixed(2)}</div>
          <div className="text-lg font-base ml-28 mr-16">{close.toFixed(2)}</div>
          <div className={change>=0 ? 'text-[#0ABB92] text-lg font-base ml-auto mr-auto': 'text-[#D55438] text-lg font-base ml-auto mr-auto'}>{change.toFixed(2)}</div>
          </div>
          <div>
            <button className="text-white bg-gradient-to-r from-[#0ABB92] to-[#0BAB86]
             hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 
             dark:focus:ring-green-800 font-medium rounded-lg text-sm px-3 py-2 text-center 
             mt-2 ml-4 me-2 mb-2 h-8 w-16" onClick={sellHandler}>SELL</button>
          </div>
          
         
        </div>
      );
    } else {
      return <div>No stock data available.</div>;
    }
  };
  
  export default Pcard;
  