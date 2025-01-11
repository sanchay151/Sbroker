const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true,
    },
    buyPrice: {
        type: Number,
        required: true,
    },
    todayPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true,
    },
}, {
    timestamps: true
});

const Stock = mongoose.model('Stock', stockSchema);
module.exports = Stock;
