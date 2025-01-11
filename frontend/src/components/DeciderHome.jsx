import {  useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUser, logout } from "../redux/slices/PortStock";

const DeciderHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use useNavigate for navigation
 // const userLogin = useSelector((state) => state.PortStock.userlogin);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const authtoken = localStorage.getItem("authToken");

      if (authtoken) {
        try {
          const url = "https://sbroker-backend.vercel.app/api/v1/profile/profileid";
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${authtoken}`,
            },
            withCredentials: true, // Include cookies in the request
          });

          const userinfo = response.data;

          if (userinfo.success) {
            dispatch(setUser(userinfo));
            navigate("/main"); // Navigate to the main page after login
          } else {
            throw new Error("Failed to fetch user info");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
          dispatch(logout());
          navigate("/login"); // Navigate to login on error
        }
      } else {
        dispatch(logout());
        navigate("/login"); // Navigate to login if no token exists
      }
    };

    fetchUserInfo();
  }, [dispatch, navigate]); // Add dependencies for stability

  // Render null as this component only handles redirection
  return null;
};

export default DeciderHome;
