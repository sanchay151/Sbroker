const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Stock= require("../models/Stock")
const bcrypt = require("bcrypt");
const moment = require("moment");
const crypto = require("crypto");
require('dotenv').config();
const axios = require('axios');
const nodemailer=require('nodemailer')
// signup controller
exports.signup = async (req, res) => {
    try {
        const { Name, phoneNumber, email, userpassword, confirmuserpassword } = req.body;

        if (!Name || !phoneNumber || !email || !userpassword || !confirmuserpassword) {
            return res.status(403).send({
                success: false,
                message: "All Fields are required",
            });
        }

        if (userpassword !== confirmuserpassword) {
            return res.status(400).json({
                success: false,
                message: "userpassword and Confirm userpassword do not match. Please try again.",
            });
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists, please sign in to continue",
            });
        }

        const hasheduserpassword = await bcrypt.hash(userpassword, 10);
        const styleName = 'pixel-art'; // Choose the style you want to use
        const dicebearApiUrl = `https://api.dicebear.com/9.x/${styleName}/svg?seed=${Name}`;

        const svgResponse = await axios.get(dicebearApiUrl, { responseType: 'text' });
        const svg = svgResponse.data;

        const user = await User.create({
            Name,
            phoneNumber,
            email,
            UserPassword:hasheduserpassword,
            stocksHolding: null,
            watchlist: "00",
            wallet: 0,
            overallProfit: 0,
            dp: svg,
            token: null,
            lastPriceUpdate: null, // Initialize last price update
        });

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};

// login controller
exports.login = async (req, res) => {
    try {
        const { email, userpassword } = req.body;

        if (!email || !userpassword) {
            return res.status(400).json({
                success: false,
                message: "Please Fill up All the Required Fields",
            });
        }

        const user = await User.findOne({ email });
        user.populate('stocksHolding');
      //  const user=User.findById(vsr._id).populate('stocksHolding');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not Registered with Us Please SignUp to Continue",
            });
        }


        const userpasswordMatch = await bcrypt.compare(userpassword, user.UserPassword);
        if (!userpasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "userpassword is incorrect",
            });
        }

        // update today's price once a day after 8 AM
        const lastUpdate = user.lastPriceUpdate;
        const now = moment();
        const today8AM = moment().hour(8).minute(0).second(0);

        if (!lastUpdate || moment(lastUpdate).isBefore(today8AM)) {
            await updateStockPrices(user);
            user.lastPriceUpdate = now;
            await user.save();
        }

        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

       // user.token = token;
      //  user.UserPassword = undefined;
        await user.save();
        user.UserPassword=undefined;
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "User Login Success",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure Please Try Again",
        });
    }
};
exports.forgotuserpassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists with the given email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User with this email does not exist",
            });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash and set the token in the database
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.token = hashedToken;
        user.expiretime = Date.now() + 100 * 60 * 1000; // Token valid for 100 minutes
        await user.save();

        // Send reset token email
        const resetURL = `${req.protocol}://localhost:3000/userpasswordreset/${resetToken}`;

        // Nodemailer setup
  /*      const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME, // Ensure this is correctly set
                pass: process.env.EMAIL_PASSWORD  // Ensure this is correctly set
            }
        }); */
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASSWORD
            },
          });
    //    console.log('EMAIL_USERNAME:', process.env.EMAIL_USERNAME);
    //console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);


        const message = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forgot Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }

    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .email-header {
      background-color: #007bff;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }

    .email-body {
      padding: 20px;
      line-height: 1.6;
      color: #333333;
    }

    .email-footer {
      background-color: #f8f9fa;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #777777;
    }

    .email-footer a {
      color: #007bff;
      text-decoration: none;
    }

    .button {
      display: inline-block;
      padding: 10px 20px;
      margin: 20px 0;
      color: #ffffff;
      background-color: #ff4d4d;
      border-radius: 5px;
      text-decoration: none;
      font-size: 16px;
    }

    .button:hover {
      background-color: #ff3333;
    }

    @media only screen and (max-width: 600px) {
      .email-container {
        width: 90%;
      }

      .email-header {
        font-size: 20px;
      }
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="email-body">
      <p>Hi ${user.Name},</p>
      <p>We received a request to reset your password. Click the button below to reset it:</p>
      <a href="${resetURL}" class="button">Reset Password</a>
      <p>If you didn’t request a password reset, please ignore this email. Your password will remain unchanged.</p>
      <p>For any issues, feel free to contact our support team.</p>
      <p>Thank you,<br />The SBroker Team</p>
    </div>
  </div>
</body>

</html>
`;

        await transporter.sendMail({
            to: user.email,
            subject: "userpassword Reset Request",
            html:message
        });

        return res.status(200).json({
            success: true,
            message: `userpassword reset link sent to ${user.email}`,
           
        });

    } catch (error) {
        console.error("Error sending userpassword reset email:", error);
        return res.status(500).json({
            success: false,
            message: "Could not send userpassword reset email, please try again",
        });
    }
};
exports.resetuserpassword = async (req, res) => {
    try {
        const { resetToken } = req.params;
        const { newuserpassword, confirmuserpassword } = req.body;

        if (!newuserpassword || !confirmuserpassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (newuserpassword !== confirmuserpassword) {
            return res.status(400).json({
                success: false,
                message: "userpasswords do not match",
            });
        }

        // Hash the token and compare with the stored token
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        
        const user = await User.findOne({
            token: hashedToken,
            expiretime: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token",
                
            });
        }

        // Hash and set the new userpassword
        const hasheduserpassword = await bcrypt.hash(newuserpassword, 10);
        user.hasheduserpassword = hasheduserpassword;
        user.resetuserpasswordToken = undefined;
        user.resetuserpasswordExpire = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "userpassword reset successfully",
        });

    } catch (error) {
        console.error("Error resetting userpassword:", error);
        return res.status(500).json({
            success: false,
            message: "Could not reset userpassword, please try again",
        });
    }
};

// logout controller
exports.logout = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

// Helper to update stock prices
const updateStockPrices = async (user) => {
    try {
        if (!user.stocksHolding || user.stocksHolding.length === 0) {
            console.log("No stocks in portfolio");
            return;
        }

        // Fetch stock prices
        const stockTickers = user.stocksHolding.map(stock => stock.ticker);
        const stockPrices = await fetchStockPricesFromAPI(stockTickers);

        // Update each Stock document in the database
        for (let stock of user.stocksHolding) {
            const newPrice = stockPrices[stock.ticker];

            if (newPrice !== null) {
                await Stock.findByIdAndUpdate(
                    stock._id, // Find the specific Stock document
                    { todayPrice: newPrice }, // Update the `todayPrice`
                    { new: true } // Return the updated document
                );
            }
        }

        console.log("Stock prices updated successfully");
    } catch (error) {
        console.error("Error updating stock prices:", error);
    }
};


// Fetch stock prices from an external API
const fetchStockPricesFromAPI = async (stockTickers) => {
    try {
        const stockPrices = [];
        const key = process.env.STOCK_API_KEY;

        for (let i = 0; i < stockTickers.length; i++) {
            const ticker = stockTickers[i];
            const p = await axios.get(`https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${key}`);
            
            if (p.data && p.data[0] && p.data[0].price) {
                stockPrices[ticker] = p.data[0].price; // Store price by ticker
            } else {
                stockPrices[ticker] = null; // Handle case where price is not found
            }
        }

        return stockPrices;

    } catch (error) {
        console.error("Error fetching stock prices from API:", error);
        throw error;
    }
};
