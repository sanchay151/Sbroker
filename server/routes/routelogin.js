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
router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);

// Forgot userpassword route
router.post("/forgot-userpassword", forgotuserpassword);

// Reset userpassword route (requires token in the URL)
router.post("/userpasswordreset/:resetToken", resetuserpassword);

module.exports = router;
