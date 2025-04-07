const express = require("express");
const router = express.Router();
const cors = require("cors");

// Define the CORS configuration properly
const corsConfig = {
  origin: ["http://localhost:3000", "https://sbroker.vercel.app"],
  credentials: true,
};

// Apply CORS middleware to the router
router.use(cors(corsConfig));

const {
  signup,
  login,
  forgotuserpassword,
  resetuserpassword,
  logout,
} = require("../controllers/login");

// login and signup
router.post("/login", login);
router.post("/signup", signup);
router.get("/logout", logout);

// Forgot userpassword route
router.post("/forgot-userpassword", forgotuserpassword);

// Reset userpassword route (requires token in the URL)
router.post("/userpasswordreset/:resetToken", resetuserpassword);

module.exports = router;
