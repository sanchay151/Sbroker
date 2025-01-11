import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaSearch,FaArrowLeft  } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "./Sbroker.png";
import ProfileButton from "./ProfileButton";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Spner from "./Spner";
import useIsMobile from "./useIsMobile";

const Navbar = () => {
    const isMobile = useIsMobile();
    var key1;
    var radnum=Math.floor(Math.random() * 3) + 1;
    if(radnum===2){
       key1="AIzaSyCMFFVM5YkWs17nkHnk2h9tgT0El2s2zug";
    }
    else{
       key1="AIzaSyCx5FO7g2uAZMV0Sy5qzqTV2Y0jIWiOiI4";
    }
    const genAI = new GoogleGenerativeAI(key1);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const [stocks, setStocks] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setSuggestions([]); // Clear suggestions when clicking outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function changeHandler(event) {
        setStocks(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (stocks) {
            setLoading(true); // Show spinner during API call
            setSuggestions([]);
            const prompt = `for this word ${stocks}, give me 3 nasdaq stocks which are closest to it, like if its AAPL then give me Apple, and 2 other with similar names, 
            also i want response to be only 3 company name, no other word other than that and those names should be their names as listed on nasdaq and format should be {ticker1,stockname1,ticker2,stockname2,ticker3,stockname3},
             by company name or stock name i mean the name of the companies listed on nasdaq, and it should be proper company name. if in worst case you cant find any company resembling, just give any 3 stocks from first letter of the search in format given to you. 
             dont give response other than that format`;

            try {
                const result = await model.generateContent(prompt);
                setLoading(false); // Hide spinner after response
                const responseText = result.response.candidates[0].content.parts[0].text;
                const matches = responseText.match(/\{(.+?)\}/);
                if (matches) {
                    const companies = matches[1].split(",");
                    const formattedSuggestions = [
                        { symbol: companies[0], name: companies[1] },
                        { symbol: companies[2], name: companies[3] },
                        { symbol: companies[4], name: companies[5] },
                    ];
                    setSuggestions(formattedSuggestions);
                } else {
                    toast.error("Invalid response from the API.");
                }
            } catch (error) {
                setLoading(false);
                toast.error("Error fetching stock suggestions.");
            }
        }
    }

    const handleSuggestionClick = (stockSymbol) => {
        navigate(`/main/stockinfo/${stockSymbol}`);
        setStocks("");
        setSuggestions([]);
    };

    return (
        <div className="w-screen h-20 flex flex-row items-center border-b-2 border-[#2E2E2E]">
            {isMobile ? (
                <div className="flex flex-row items-center gap-4 ml-12">
                    {!isSearchActive && (
                        <>
                          {/* Logo and Name */}
                          <NavLink to="/">
                          <div className="flex items-center space-x-2">
                            <img className="w-10 h-10 sm:w-11 sm:h-11" src={logo} alt="SBroker Logo" />
                            <span className="font-bold text-3xl sm:text-base">SBroker</span>
                          </div>
                          </NavLink>
                          {/* Explore */}
                         
                
                          {/* Search Icon */}
                          <button
                            className="ml-20 text-[#B8B8B8] text-2xl sm:hidden"
                            onClick={() => setIsSearchActive(true)}
                          >
                            <FaSearch />
                          </button>
                
                          {/* Portfolio and Profile */}
                          <div className=" mr-24 ml-4 sm:ml-8">
                            <ProfileButton />
                          </div>
                          
                          
                        </>
                      )}
                
                      {/* Search Bar for Mobile */}
                      {isSearchActive && (
                        <div className="flex items-center w-full">
                          <button
                            className="text-[#B8B8B8] text-lg mr-2"
                            onClick={() => setIsSearchActive(false)}
                          >
                            <FaArrowLeft />
                          </button>
                          <form
                            onSubmit={handleSubmit}
                            className="flex items-center w-full"
                            ref={wrapperRef}
                          >
                            <input
                              className="bg-[#121212] text-[#B8B8B8] border-2 border-[#2E2E2E] rounded-md px-2 py-1 w-full"
                              type="text"
                              placeholder="Search for a stock"
                              onChange={changeHandler}
                              name="stocks"
                              value={stocks}
                            />
                            <button type="submit" className="text-[#B8B8B8] ml-2">
                              <FaSearch />
                            </button>
                            {loading && <Spner />}
                            {suggestions.length > 0 && (
                        <div className="absolute top-12 bg-[#121212] text-white border border-[#2E2E2E] rounded-md w-96 max-h-40 overflow-y-auto z-50">
                            {suggestions.map((stock, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 cursor-pointer hover:bg-[#2E2E2E]"
                                    onClick={() => handleSuggestionClick(stock.symbol)}
                                >
                                    {stock.symbol} - {stock.name}
                                </div>
                            ))}
                        </div>
                    )}
                          </form>
                        </div>
                      )}
                      </div>
                
            ) : (
                <div className="flex flex-row items-center">
                     <div className="flex flex-row items-center">
                        <div className="flex flex-row mx-10 space-x-6 justify-between ml-20">
                <NavLink to="/">
                    <div className="flex flex-row items-center space-x-2">
                        <img className="w-11 h-11" src={logo} alt="abb" />
                        <span className="font-bold">SBroker</span>
                    </div>
                </NavLink>
                <NavLink to="/">
                    <div
                        id="explore"
                        className="text-[#0ABB92] mt-2 font-semibold ml-20 text-lg hover:underline"
                    >
                        Explore
                    </div>
                </NavLink>
            </div>

            <div className="flex flex-row gap-4 ml-auto mr-auto place-items-center">
                <form onSubmit={handleSubmit} className="flex flex-col items-center relative">
                    <div className="flex flex-row items-center space-x-2">
                        <input
                            className="bg-[#121212] text-[#B8B8B8] border-2 border-[#2E2E2E] rounded-md px-4 py-2 w-96"
                            type="text"
                            placeholder="What stock do you want to search today?"
                            onChange={changeHandler}
                            name="stocks"
                            value={stocks}
                        />
                        <button type="submit" className="text-[#B8B8B8]">
                            <FaSearch />
                        </button>
                        {loading && <Spner/>} 
                    </div>
                    
                    {suggestions.length > 0 && (
                        <div className="absolute top-12 bg-[#121212] text-white border border-[#2E2E2E] rounded-md w-96 max-h-40 overflow-y-auto z-50">
                            {suggestions.map((stock, index) => (
                                <div
                                    key={index}
                                    className="px-4 py-2 cursor-pointer hover:bg-[#2E2E2E]"
                                    onClick={() => handleSuggestionClick(stock.symbol)}
                                >
                                    {stock.symbol} - {stock.name}
                                </div>
                            ))}
                        </div>
                    )}
                </form>

                <NavLink to="/main/portfolio">
                    <div
                        id="p"
                        className="text-white hover:text-[#0abb81] font-semibold ml-20 text-lg hover:underline"
                    >
                        Portfolio
                    </div>
                </NavLink>
                <div className="ml-8 mr-8 pr-8">
                    <ProfileButton />
                </div>
            </div>
                </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
