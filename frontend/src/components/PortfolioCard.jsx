import { useSelector } from "react-redux";
const PortfolioCard= () =>{
    const inv=useSelector((state)=> state.PortStock.invested)
    const portv=useSelector((state)=>state.PortStock.profit)
    return (
      <div className="flex flex-row bg-[#121212] justify-evenly border-2 border-[#2E2E2E] gap-6 rounded-md">
         <div className="flex flex-col">
         <div className={(portv)>=0 ? 'text-xl mt-2 mb-1 font-semibold text-[#0ABB92]':'text-xl font-semibold mt-2 mb-1 text-[#0ABB92]'}>${(portv).toFixed(0)}</div>
         <div className=" mb-2 font-base test-xs text-[#B8B8B8]">Total Profit</div>
         </div>
         <div>
         <div className="text-xl mt-2 mb-1 font-semibold ">${(inv-0).toFixed(0)}</div>
         <div className="mb-2 font-base test-xs text-[#B8B8B8]">Total Invested</div>
         </div>
         
      </div>
    )
  };
  export default PortfolioCard