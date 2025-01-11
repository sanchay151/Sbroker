const express = require("express");
const router = express.Router();
  const {
    stockdata,
    buystock,
    sellstock,
    calculateInvestmentAndProfit
}=require("../controllers/stock")

const {
    authenticateToken 

 }=require("../middleware/Auth");
router.get("/stockdata/:userId",authenticateToken,stockdata);
router.post("/buystock/:userId",authenticateToken,buystock);
router.post("/sellstock/:userId",authenticateToken,sellstock);
router.get("/totalprofit/:userId",authenticateToken,calculateInvestmentAndProfit);

module.exports=router;
