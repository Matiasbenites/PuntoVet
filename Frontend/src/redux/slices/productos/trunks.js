import { useSelector } from "react-redux";
import { productosApi } from "../../../api/productos/productosApi";
import { cargandoProductos, setProductos } from "./productoSlice"




export const getProductos = () => {
    return async (dispatch) => {
        dispatch(cargandoProductos());
        const { data } = await productosApi.get('/producto');
        //dispatch ( setProductos ( { productos: data} ) )
        return data;
    }
}

export const postProducto = (producto) => {
    return async () => {
        try {
            const response = await productosApi.post('/producto', producto)
            console.log('datos enviados: ', response);
        } catch (error) {
            console.log(error);
        }

    }
}