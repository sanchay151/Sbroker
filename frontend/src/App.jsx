import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import DeciderHome from "./components/DeciderHome";
import MainHome from "./components/MainHome";
//import Home from "./components/Home";
//import StockInfo from "./components/StockInfo";
//import Watchlist from "./components/Watchlist";
//import Portfolio from "./components/Portfolio";
import LoginHome from "./components/LoginHome";
import FPassword from "./components/FPassword";
import RPassword from "./components/RPassword";
import { useEffect } from "react";
function App() {
  useEffect(() => {
    document.title = "Sbroker";
  }, []);
  return (
    <div className="bg-[#121212] text-white h-screen w-screen overflow-x-hidden">
      <Routes>
        {/* DeciderHome determines redirection between MainHome and LoginHome */}
        <Route path="/" element={<DeciderHome />} />

        {/* Nested Routes under MainHome */}
        <Route path="/main/*" element={<MainHome />}>
        
        </Route>

        {/* Nested Routes under LoginHome */}
        <Route path="/login" element={<LoginHome />}>
        </Route>
        <Route path="forgot-password" element={<FPassword />} />
        <Route path="userpasswordreset/:ResetToken" element={<RPassword/>}/>
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default App;
