import { useNavigate } from "react-router-dom";
import useIsMobile from "./useIsMobile";

const Pcard = ({ gains, stockname }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const gohandler = () => {
    navigate(`/main/stockinfo/${stockname}`);
  };

  if (!gains) {
    return <div>No stock data available.</div>;
  }

  const stock = gains;
  const open = parseFloat(stock.buyPrice || 0);
  const close = parseFloat(stock.todayPrice || 0);
  const change = close - open;
  const changePercent = (open !== 0 ? (change / open) * 100 : 0).toFixed(2);

  const isPositive = change >= 0;
  const changeClass = isPositive
    ? "text-[#0ABB92] text-lg font-base ml-auto mr-auto"
    : "text-[#D55438] text-lg font-base ml-auto mr-auto";

  const buttonClassName = `text-lg font-semibold ml-4 ${
    stockname?.length === 3 ? "mr-9" : "mr-6"
  }`;

  return (
    <div className="flex flex-col mt-2 mb-4 border-b border-gray-700 pb-2">
      <div className="flex flex-row">
        <button
          className={isMobile ? buttonClassName : "text-lg font-semibold ml-4 mr-16"}
          onClick={gohandler}
        >
          {stockname}
        </button>

        <div className={isMobile ? "text-lg font-base ml-4 mr-4" : "text-lg font-base ml-28 mr-16"}>
          {open.toFixed(2)}
        </div>

        <div className={isMobile ? "text-lg font-base ml-4 mr-4" : "text-lg font-base ml-28 mr-16"}>
          {close.toFixed(2)}
        </div>

        <div className={changeClass}>{changePercent}%</div>
      </div>

      <div className="text-sm font-base ml-4 mr-4">{stock.quantity} shares</div>
    </div>
  );
};

export default Pcard;
