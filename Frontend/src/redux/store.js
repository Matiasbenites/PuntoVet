import { configureStore } from "@reduxjs/toolkit";
import { productosSlice } from "./slices/productos/productoSlice";
import { authSlice } from "./slices/auth/authSlice";





export const store = configureStore({
    reducer: {
        productos: productosSlice.reducer,
        auth: authSlice.reducer
    }
})