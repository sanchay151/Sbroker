const express = require("express");
const router = express.Router();

const{
    moneyin,
    updateProfilePicture,
    profileid
}=require("../controllers/profile");

const { authenticateToken } = require("../middleware/Auth");

router.post("/moneyin/:userId",authenticateToken,moneyin);
router.get("/profileid",authenticateToken,profileid);
router.post("/updatedp/:userId",authenticateToken,updateProfilePicture);

module.exports=router;