import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { moneyin } from "../redux/slices/PortStock";
import { updatedp } from "../redux/slices/PortStock";
import axios from "axios";
import { FaArrowLeft, FaCamera } from "react-icons/fa";
import useIsMobile from "./useIsMobile";
import { NavLink } from "react-router-dom";
const ProfileHome = () => {
  const isMobile=useIsMobile();
  const dispatch = useDispatch();
  const { UserId, Username, email, PhoneNo, wallet, dp, invested, profit } =
    useSelector((state) => state.PortStock);
  const [addAmount, setAddAmount] = useState("");

  const handleAddMoney = async () => {
    const amountToAdd = parseFloat(addAmount);
    if (!isNaN(amountToAdd) && amountToAdd > 0) {
      if (amountToAdd <= 10000) {
        try {
          const url = `https://sbroker-backend.vercel.app/api/v1/profile/moneyin/${UserId}`;
          const authtoken = localStorage.getItem("authToken");
          const amountinfo = {
            amount: amountToAdd,
          };
          const res = await axios.post(
            url,
            amountinfo,
            {
              headers: {
                Authorization: `Bearer ${authtoken}`,
              },
            },
            { withCredentials: true }
          );
          if (res.status === 200) {
            dispatch(moneyin({ wallet: wallet + amountToAdd }));
            setAddAmount(""); // Reset input
            alert(`$${amountToAdd} added successfully!`);
          }
        } catch (error) {
          alert("Error occurred, please try again");
          console.log(error);
        }
      } else {
        alert("Wallet limit of $10000 exceeded!");
      }
    } else {
      alert("Please enter a valid amount!");
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("dp", file);

      try {
        const authtoken = localStorage.getItem("authToken");

        const response = await axios.post(
          `https://sbroker-backend.vercel.app/api/v1/profile/updatedp/${UserId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
            withCredentials: true,
          }
        );

        const result = response.data;
        if (response.status === 200) {
          // Dispatch updated DP URL to Redux store
          dispatch(updatedp({ dp: result.dp }));
          alert("Profile picture updated successfully!");
        } else {
          alert(result.message || "Error updating profile picture");
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
        alert("An error occurred while uploading the profile picture.");
      }
    }
  };

  return (
    <div className="bg-[#121212] text-white min-h-screen p-6">
      {isMobile===true?(<NavLink to="/main/" >
              <div className=' mt-4 mb-4'>
              <FaArrowLeft className='h-6 w-6'/>
                </div>
              </NavLink>):("")}
      <div className="max-w-4xl mx-auto bg-[#1e1e1e] p-6 rounded-lg">
        <h1 className="text-xl font-bold mb-4">Basic Info</h1>
        <div className="flex items-center space-x-6">
          {/* Profile Picture */}
          <div className="relative group">
            <img
              src={dp || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full"
            />
            <div className="absolute top-0 left-0 w-full h-full rounded-full flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-white text-sm"><FaCamera/></span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleProfilePicChange}
            />
          </div>
          {/* User Info */}
          <div>
            <h2 className="text-2xl font-bold">{Username}</h2>
            <p className="text-sm text-gray-400">{email}</p>
            <p className="text-sm text-gray-400">{PhoneNo}</p>
          </div>
        </div>

        {/* Display Investments and Profit */}
        <div className="mt-8 bg-[#1e1e1e] p-4 rounded-lg">
          <h3 className="text-lg font-bold">Financial Details</h3>
          <p className="text-sm mt-2">Wallet Balance: ${wallet.toFixed(2)}</p>
          <p className="text-sm">Invested: ${invested.toFixed(2)}</p>
          <p className="text-sm">Profit: ${profit.toFixed(2)}</p>
        </div>

        {/* Wallet Section */}
        <div className="mt-8 bg-[#1e1e1e] p-4 rounded-lg">
          <h3 className="text-lg font-bold">Wallet</h3>
          <div className="flex mt-4">
            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              placeholder="Add money (USD)"
              className="w-full p-2 rounded-lg bg-[#2e2e2e] text-white border-none outline-none"
            />
            <button
              onClick={handleAddMoney}
              className="bg-green-500 px-4 py-2 rounded-lg ml-4 hover:bg-green-600"
            >
              Add
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-2">Wallet limit: $10000</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHome;
