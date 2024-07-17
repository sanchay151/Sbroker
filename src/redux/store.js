import { configureStore } from "@reduxjs/toolkit";
import  { PortStock } from "./slices/PortStock";

export const store = configureStore({
    reducer:{
        PortStock: PortStock.reducer,
    }
});