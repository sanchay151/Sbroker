const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotuserpassword,
  resetuserpassword,
  logout,
} = require("../controllers/login");

//const { authenticateToken } = require("../middleware/Auth");

// login and signup
router.get("/login", login);
router.get("/signup", signup);
router.get("/logout", logout);

// Forgot userpassword route
router.get("/forgot-userpassword", forgotuserpassword);

// Reset userpassword route (requires token in the URL)
router.get("/userpasswordreset/:resetToken", resetuserpassword);

module.exports = router;
