import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import StockInfo from "./components/StockInfo";
import Portfolio from "./components/Portfolio";
import Watchlist from "./components/Watchlist";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <div className="bg-[#121212] text-white h-screen w-screen overflow-x-hidden">
      
      <div>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stockinfo/:stockName" element={<StockInfo />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
