import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  GainStock: [], 
  LoseStock: [], 
};

export const GainLose = createSlice({
  name: "GainLose",
  initialState,
  reducers: {
    setGainers(state, action) {
      state.GainStock = action.payload; 
    },
    setLosers(state, action) {
      state.LoseStock = action.payload;
    },
  },
});

export const { setGainers, setLosers } = GainLose.actions;
export default GainLose.reducer;
