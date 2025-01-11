const express = require("express");
const router = express.Router();

const {
     watchstock,
     addtowatchlist,
     removeFromWatchlist,
     checkWatchlist

}=require("../controllers/watchlist");

const { authenticateToken   }=require("../middleware/Auth");

router.get("/watchliststocks/:userId",authenticateToken,watchstock);
router.post("/addtowatchlist/:userId",authenticateToken,addtowatchlist);
router.post("/removefromwatchlist/:userId",authenticateToken,removeFromWatchlist);
router.get("/checkwatchlist/:userId",authenticateToken,checkWatchlist);

module.exports=router;
