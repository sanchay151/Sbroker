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

dotenv.config();
const PORT = process.env.PORT || 4000;

// Connect to the database
database.connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1); // Exit the process if the database connection fails
  });

// Middleware
app.use(
  cors({
    origin: ["https://sbroker.vercel.app", "http://localhost:3000"], // Allow frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allow all methods
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
    ], // Include necessary headers
    credentials: true, // Allow cookies
  })
);

app.use(express.json());
app.use(cookieparser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")); // Use 'dev' logging in development

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
