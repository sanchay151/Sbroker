const express = require("express");
const app = express();
const userroutes = require("./routes/routelogin");
const profileroutes = require("./routes/routeprofile");
const stockroutes = require("./routes/routestock");
const watchlistroute = require("./routes/routewatchlist");
const database = require("./config/database");
const cookieparser = require("cookie-parser");
const cors = require('cors');
const dotenv = require("dotenv");
const morgan = require('morgan');  // Logging middleware

dotenv.config();
const PORT = process.env.PORT || 4000;

// Connect to the database
database.connect();

app.use(
  cors({
    origin: ["https://sbroker.vercel.app","http://localhost:3000"], // Allow your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Explicitly allow all methods
    allowedHeaders: [
      "X-CSRF-Token",
      "X-Requested-With",
      "Accept",
      "Accept-Version",
      "Content-Length",
      "Content-MD5",
      "Content-Type",
      "Date",
      "X-Api-Version",
    ], // Include the necessary headers
    credentials: true, // Enable credentials (cookies)
  })
);

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://sbroker.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200); // Respond OK to preflight requests
});

// Middleware
app.use(express.json());
app.use(cookieparser());
app.use(morgan('combined')); // Logging middleware

// Routes
app.use("/api/v1/user", userroutes);
app.use("/api/v1/profile", profileroutes);
app.use("/api/v1/stock", stockroutes);
app.use("/api/v1/watchlist", watchlistroute);

// Root route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
