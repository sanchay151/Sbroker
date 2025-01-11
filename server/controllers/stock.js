const User = require('../models/User');
const Stock = require('../models/Stock');

// Controller for fetching specific stock data for a user
exports.stockdata = async (req, res) => {
    try {
        const { stockticker } = req.body;
        const { userId } = req.params;

        const user = await User.findById(userId).populate('stocksHolding');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const stockInfo = user.stocksHolding.find(stock => stock.ticker === stockticker);
        if (stockInfo) {
            return res.status(200).json({
                success: true,
                message: "Stock info for this stock",
                stockInfo
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'This user does not own this stock',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving stock data",
        });
    }
};

// Controller for buying stocks
exports.buystock = async (req, res) => {
    try {
        const { stockticker, buyprice, quantity, todayprice } = req.body;
        const { userId } = req.params;

        const user = await User.findById(userId).populate('stocksHolding');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (user.stocksHolding === null) {
            const newStock = await Stock.create({
                ticker: stockticker,
                buyPrice: buyprice,
                todayPrice: todayprice,
                quantity,
                user: userId,
            });

            user.stocksHolding = [newStock._id];
            user.wallet -= (quantity * buyprice);
            await user.save();

        } else {
            let stockInfo = await Stock.findOne({ ticker: stockticker, user: userId });

            if (!stockInfo) {
                const newStock = await Stock.create({
                    ticker: stockticker,
                    buyPrice: buyprice,
                    todayPrice: todayprice,
                    quantity,
                    user: userId,
                });

                user.stocksHolding.push(newStock._id);

            } else {
                stockInfo.buyPrice = ((stockInfo.quantity * stockInfo.buyPrice) + (quantity * buyprice)) / (stockInfo.quantity + quantity);
                stockInfo.quantity += quantity;
                stockInfo.todayPrice = todayprice;
                await stockInfo.save();
            }

            user.wallet -= (quantity * buyprice);
            await user.save();
        }

        // Re-fetch the updated user with populated stocksHolding
        const updatedUser = await User.findById(userId).populate('stocksHolding');

        return res.status(200).json({
            success: true,
            message: "Stock processed successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while buying the stock",
        });
    }
};

// Controller for selling stocks
exports.sellstock = async (req, res) => {
    try {
        const { stockticker, sellprice, quantity } = req.body;
        const { userId } = req.params;

        const user = await User.findById(userId).populate('stocksHolding');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const stockInfo = user.stocksHolding.find(stock => stock.ticker === stockticker);
        if (!stockInfo) {
            return res.status(404).json({
                success: false,
                message: 'Stock not found in holdings',
            });
        }

        const oldQuantity = stockInfo.quantity;
        const oldBuyPrice = stockInfo.buyPrice;

        if (oldQuantity === quantity) {
            // Remove stock from user's holdings
            await Stock.findByIdAndRemove(stockInfo._id);
            user.stocksHolding = user.stocksHolding.filter(stock => stock._id.toString() !== stockInfo._id.toString());

            // Update wallet and overall profit
            user.wallet += (sellprice - oldBuyPrice) * quantity;
            user.overallProfit += (sellprice - oldBuyPrice) * quantity;
            await user.save();

        } else if (oldQuantity > quantity) {
            // Update stock quantity and buy price
            stockInfo.quantity = oldQuantity - quantity;
            stockInfo.buyPrice = ((oldQuantity * oldBuyPrice) - (quantity * sellprice)) / stockInfo.quantity;
            await stockInfo.save();

            // Update wallet and overall profit
            user.wallet += quantity * (sellprice - oldBuyPrice);
            user.overallProfit += quantity * (sellprice - oldBuyPrice);
            await user.save();

        } else {
            return res.status(400).json({
                success: false,
                message: 'Quantity to sell exceeds holdings',
            });
        }

        // Re-fetch the updated user with populated stocksHolding
        const updatedUser = await User.findById(userId).populate('stocksHolding');

        return res.status(200).json({
            success: true,
            message: "Stock sold successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while selling the stock",
        });
    }
};


// Controller for calculating total investment and profit
exports.calculateInvestmentAndProfit = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate('stocksHolding');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        let totalInvestment = 0;
        let totalProfit = 0;
        if(user.stocksHolding){
            user.stocksHolding.forEach(stock => {
                const { buyPrice, quantity, todayPrice } = stock;
                totalInvestment += buyPrice * quantity;
                totalProfit += (todayPrice - buyPrice) * quantity;
            });
        }
        

        return res.status(200).json({
            success: true,
            totalInvestment,
            totalProfit,
            message: 'Investment and profit calculated successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while calculating investment and profit',
        });
    }
};

