import { configureStore } from "@reduxjs/toolkit";
import  { PortStock } from "./slices/PortStock";
import { GainLose } from "./slices/GainLose";
import { Watchlistdata } from "./slices/Watchlistdata";
export const store = configureStore({
    reducer:{
        PortStock: PortStock.reducer,
        GainLose: GainLose.reducer,
        Watchlistdata:Watchlistdata.reducer
    }
});