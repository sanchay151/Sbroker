import React from "react";
import { Outlet } from "react-router-dom";
import LoginForm from "./LoginForm";
import chartimage from "./chartup.png"; // Ensure the path is correct
import bull from "./bull.png"; // Ensure the path is correct

const LoginHome = () => {
  return (
    <div className="relative bg-black min-h-screen overflow-y-hidden">
      {/* SBroker Title with Logo */}
      <div className="flex flex-row gap-4 ">
         
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold z-10">
        SBroker
      </div>
      </div>
      
      

      {/* Login Form and Outlet */}
      <div className="flex justify-center items-center h-full pt-72">
        <div className="relative z-20">
          <LoginForm />
          <Outlet />
        </div>
      </div>

      {/* Chart Image on Left Bottom */}
      <div
        className="absolute bottom-0 left-0 opacity-25 z-0 ml-4"
        style={{
          width: "500px",
          height: "350px",
          backgroundImage: `url(${chartimage})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          
        }}
      ></div>

      {/* Bull Image on Right Bottom */}
      <div
        className="absolute bottom-0 right-0 z-0 mr-4"
        style={{
          width: "500px",
          height: "350px",
          backgroundImage: `url(${bull})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          opacity:0.25
        }}
      ></div>
    </div>
  );
};

export default LoginHome;
