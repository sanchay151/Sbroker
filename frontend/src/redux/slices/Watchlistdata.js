import { createSlice } from "@reduxjs/toolkit";
const initialState={
    watchstock:[]
}
export const Watchlistdata= createSlice({
    name:"Watchlistdata",
    initialState,
    reducers:{
        setwatchstock(state,action){
            state.watchstock=action.payload;
        }
    }
})
export const { setwatchstock }=Watchlistdata.actions;
export default Watchlistdata.reducer;