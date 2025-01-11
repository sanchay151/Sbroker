const moment = require('moment');
const User=require('../models/User');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { updateStockPrices } = require('./login');
exports.moneyin= async(req,res)=>{
    try {
        // user id aur money nikalo
        const { userId } = req.params;  
        const { amount } = req.body;    
        // money undefined toh nhi
        if (amount === undefined) {
            return res.status(400).json({
                success: false,
                message: "Amount to update the wallet is required.",
            });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update the wallet amount
        user.wallet = user.wallet + amount;

        // Save the updated user
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Wallet updated successfully",
            wallet: user.wallet,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error updating wallet",
        });
    }

};
exports.profileid= async (req,res)=>{
    try {
        const  userId = req.subse.id; 
        
        const user = await User.findById(userId).populate('stocksHolding');
        const lastUpdate = user.lastPriceUpdate;
        const now = moment();
        const today8AM = moment().hour(8).minute(0).second(0);

        if (!lastUpdate || moment(lastUpdate).isBefore(today8AM)) {
            await updateStockPrices(user);
            user.lastPriceUpdate = now;
            await user.save();
        }
        console.log(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                userId,
                message: "User not found",
            });
        }
        
        return res.status(200).json({
            success:true,
            message:"profile data given",
            user

        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating profile data",
        });
    }
}

// cloudinary related keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// multer aur cloudinary system setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile-pictures',  
    allowed_formats: ['jpeg', 'png', 'jpg'],  
  },
});

// Set up multer to use Cloudinary for file storage
const upload = multer({ storage: storage }).single('dp'); 

// Controller to update profile picture
exports.updateProfilePicture = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Error uploading file',
      });
    }

    try {
      const { userId } = req.params;

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // If a file is uploaded, update the dp (profile picture) URL
      if (req.file && req.file.path) {
        user.dp = req.file.path; 
      }

      // Save the updated user profile
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile picture updated successfully',
        dp: user.dp, 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error updating profile picture',
      });
    }
  });
};

