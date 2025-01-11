const mongoose= require("mongoose");

const userSchema= new mongoose.Schema({
       Name : {
        type:String,
        required:true,
       },
       phoneNumber : {
        type:String,
        required:true,
       },
       email :{
          type:String,
          required:true,
       },
       UserPassword :{
           type:String,
           required:true,
       },
       stocksHolding :[{
           type:mongoose.Schema.Types.ObjectId,
           ref:"Stock",
       }],
       watchlist :[{
        type:String,
       }],
       wallet: { 
        type: Number,
         default: 0
         },
       overallProfit :{
        type: Number,
        default: 0
       },
       dp:{
         type:String,
       },
       token: {
        type: String,
    },
    expiretime:{
        type:Date,
    },
    lastPriceUpdate: {
        type: Date,
        default: null
    }
})
module.exports = mongoose.model('User', userSchema);