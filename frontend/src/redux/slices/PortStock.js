import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  UserId: "",
  Username: "",
  PhoneNo: 0,
  email: "",
  watchlist: [],
  stocks: [],
  wallet: 0,
  invested: 0,
  profit: 0,
  dp: "",
  userlogin: false,
};

export const PortStock = createSlice({
  name: "PortStock",
  initialState,
  reducers: {
    setUser(state, action) {
      // Set user data including stocks
      const  user  = action.payload;
      state.stocks = user.stocksHolding || [1234];
      state.watchlist = user.watchlist || [];
      state.wallet = user.wallet || 0;
      state.UserId = user._id;
      state.PhoneNo= user.phoneNumber;
      state.Username = user.Name;
      state.email = user.email;
      state.dp = user.dp;
      state.userlogin = true;
    },
    setInvestment(state, action) {
      state.invested = action.payload.totalInvestment;
      state.profit = action.payload.totalProfit;
    },
    logout(state) {
      // Reset to initial state
      Object.assign(state, initialState);
      localStorage.removeItem("authToken");

    },
    moneyin(state,action){
        state.wallet=action.payload.wallet;
    },
    updatedp(state,action){
         state.dp=action.payload.dp;
    },

    setbuy(state, action) {
      const  user  = action.payload;
      state.stocks = user.stocksHolding
      state.wallet = user.wallet || 0;


    },
    sell(state, action) {
      const  user  = action.payload;
      state.stocks = user.stocksHolding
      state.wallet = user.wallet || 0;

    },
    updatewatchlist(state,action){
      const user=action.payload;
      state.watchlist=user.watchlist;
    }
  },
});

// Export actions and reducer
export const { updatewatchlist,setUser, setInvestment, logout, setbuy, sell,moneyin,updatedp } = PortStock.actions;

export default PortStock.reducer;
