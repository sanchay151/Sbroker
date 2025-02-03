const express = require("express");
const app = express();
const userroutes = require("./routes/routelogin");
const profileroutes = require("./routes/routeprofile");
const stockroutes = require("./routes/routestock");
const watchlistroute = require("./routes/routewatchlist");
const database = require("./config/database");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan"); // Logging middleware
app.use(cors({
  origin: 'https://sbroker.vercel.app',
  credentials: true,
}));
dotenv.config();
const PORT = process.env.PORT || 4000;

// Connect to the database
database.connect();

// Middleware for CORS


// Other Middleware

app.use(express.json());
app.use(cookieparser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")); // Use detailed logs in development

// Routes
app.use("/user", userroutes);
app.use("/profile", profileroutes);
app.use("/stock", stockroutes);
app.use("/watchlist", watchlistroute);

// Root route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack || err.message);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
