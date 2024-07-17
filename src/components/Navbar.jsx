import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import logo from './Sbroker.png'
const Navbar = () => {
    const [stocks, setStocks] = useState("");
    const navigate = useNavigate();

    function changeHandler(event) {
        setStocks(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (stocks) {
            const url = `https://financialmodelingprep.com/api/v3/profile/${stocks}?apikey=qe1euZUsQoZdqrjiPxFjR6Jtu8CEW9DO`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.length > 0) {
                    navigate(`/stockinfo/${stocks}`);
                    setStocks("");
                } else {
                    toast.error("Stock doesn't exist");
                }
            } catch (error) {
                toast.error("Stock doesn't exist");
            }
            setStocks("");
        }
    }

    return (
        <div className="w-screen h-20 flex flex-row items-center border-b-2 border-[#2E2E2E]">
            <div className="flex flex-row mx-10 space-x-6 justify-between ml-20">
                <NavLink to='/'>
                    <div className="flex flex-row items-center space-x-2">
                    <img
                    className="w-11 h-11"
                     src={logo} alt="abb"/>
                        <span className="font-bold">SBroker</span>
                    </div>
                </NavLink>
                <NavLink to='/'>
                    <div id="explore" className="text-[#0ABB92] mt-2 font-semibold ml-20 text-lg hover:underline">
                        Explore
                    </div>
                </NavLink>
            </div>

            <div className="flex flex-row gap-4 ml-auto mr-auto place-items-center">
                <form onSubmit={handleSubmit} className="flex flex-row items-center space-x-2 mr-12">
                    <input
                        className="bg-[#121212] text-[#B8B8B8] border-2 border-[#2E2E2E] rounded-md px-4 py-2 w-96"
                        type="text"
                        placeholder="What stock do you want to search today?"
                        onChange={changeHandler}
                        name="stocks"
                        value={stocks}
                    />
                    <button type="submit" className="text-[#B8B8B8] ">
                        <FaSearch />
                    </button>
                </form>

                <NavLink to='/Portfolio'>
                    <div id="p" className="text-white hover:text-[#0abb81] font-semibold ml-20 text-lg hover:underline">
                        Portfolio
                    </div>
                </NavLink>
                
            </div>
        </div>
    );
};

export default Navbar;
