const express = require("express");
const app = express();
const userroutes = require("../routes/routelogin");
const profileroutes = require("../routes/routeprofile");
const stockroutes = require("../routes/routestock");
const watchlistroute = require("../routes/routewatchlist");
const database = require("../config/database");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan"); // Logging middleware
const login =require("../controllers/login");
// app.use(cors({
  
  // origin: 'http://localhost:3000',
  // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // credentials: true,
  // optionsSuccessStatus: 204,
// }));
app.use(
	cors({
		origin:["http://localhost:3000","https://sbroker.vercel.app"],
		credentials:true,
	})
)
dotenv.config();
const PORT = process.env.PORT || 4000;

// Connect to the database
database.connect();


app.use(express.json());
app.use(cookieparser());


// Routes
app.use("/user", userroutes);
/*app.post("/user/login",(req,res)=>{
  return res.json({
    success:true,
    message:"login wala chl rha"
  });
});
*/
//app.post("/user/login",login.login);
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


// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("Server error:", err.stack || err.message);
//   res.status(500).json({
//     success: false,
//     message: "An unexpected error occurred",
//     error: process.env.NODE_ENV === "development" ? err.message : undefined,
//   });
// });

// Start the server
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
