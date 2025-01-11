const user=require("../models/User");
exports.watchstock=async(req,res)=>{
    const {userId}= await req.params;
    const User= await user.findById(userId);
    if(User && User.watchlist){
        const watchl=User.watchlist;
        return res.status(200).json({
            success:true,
            message:"watchlist data for user",
            watchl,

        })
    }
    else{
        return res.status(404).json({
            success:false,
            message:"no user found or no user watchlist"
        })
    }
};
exports.addtowatchlist=async(req,res)=>{
   try {
    const {stockticker}=req.body;
    const {userId}= await req.params;
    const User = await user.findById(userId);
        if (!User) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
   /* const updatedUser= await User.findbyIdAndUpdate(
        userId,
        {
            $push:{
                watchlist:{
                    stockticker,
            }
            }
        },
        { new : true }
    ); */
    if (User.watchlist.includes(stockticker)) {
        return res.status(400).json({
          success: false,
          message: "Stock is already in the watchlist",
        });
      }
       User.watchlist.push(stockticker);
       User.save();
    return res.status(200).json({
        success:true,
        message:"stock added to watchlist",
        User
    })
   } catch (error) {
    console.error(error);
    return res.status(500).json({
        success: false,
        message: "An error occurred while adding stock to watchlist",
    });
   }
}
exports.removeFromWatchlist=async(req,res)=>{
    try {
        const {stockticker}=req.body;
        const {userId}= await req.params;
        const User = await user.findById(userId);
            if (!User) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            User.watchlist = User.watchlist.filter(ticker => ticker !== stockticker);
            User.save();
        return res.status(200).json({
            success:true,
            message:"stock removed from watchlist",
            User 
        })
       } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while removing stock from watchlist",
        });
       }
}
exports.checkWatchlist = async (req, res) => {
    try {
        const { stockticker } = req.body; 
        const { userId } = req.params; 

        const User = await user.findById(userId);
        if (!User) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const stockInWatchlist = User.watchlist.includes(stockticker);

        if (stockInWatchlist) {
            return res.status(200).json({
                success: true,
                message: 'Stock is present in the watchlist',
                stockticker,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Stock not found in the watchlist',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while checking the watchlist',
        });
    }
};
