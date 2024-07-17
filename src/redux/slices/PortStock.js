import { createSlice } from "@reduxjs/toolkit";

export const PortStock = createSlice({
  name: "PortStock",
  initialState: {
    stocks: [],
    invested: 0,
    portfolionow: 0
  },
  reducers: {
    buy: (state, action) => {
      const stock = action.payload;
      state.stocks.push(stock);
      const open = parseFloat(stock.open || 0);
      const close = parseFloat(stock.close || 0);
     

      state.invested += open;
      state.portfolionow += close;
      console.log(state.stocks);
    },
    sell: (state, action) => {
      const stock = action.payload;
      const open = parseFloat(stock.open || 0);
     const close = parseFloat(stock.close || 0);
    
      const index = state.stocks.findIndex((s) => s[open] === stock[open] && s[close] === stock[close]);

      if (index !== -1) {
        state.stocks.splice(index, 1);

        state.invested -= open;
        state.portfolionow -= close;
      }
      if(state.stocks.length===0){
        state.invested=0;
        state.portfolionow=0;
      }
    }
  }
});

export const { buy, sell } = PortStock.actions;

export default PortStock.reducer;
