



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productosApi } from '../../../api/productos/productosApi';

const initialState = {
  productos: [],
  isLoading: false,
  producto: {}
}

// export const enviarProducto = createAsyncThunk (
//   'productos/enviarProducto',
//   async (_, { getState }) => {
//     const state = getState ();
//     const producto = state.productos.producto;
//     productosApi.post ('/producto', producto)
//     console.log('Producto a enviar: ', producto);
//     }
// )


export const productosSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {
    cargandoProductos: (state) => {
      state.isLoading = true
    },
    setProductos: (state, action) => {
      state.isLoading = false;
      state.productos = action.payload.productos;
    },
    newProducto: (state, action) => {
      state.producto = { ...state.producto, ...action.payload };

    },
    cancelarProducto: (state) => {
      state.producto = {}
    },
    getProducto: (state) => {
      return state.producto
    }
  }
})
export const { getProducto, cargandoProductos, setProductos, newProducto, cancelarProducto } = productosSlice.actions