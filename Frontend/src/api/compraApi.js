import axios from "axios";



export const compraApi = axios.create({
    baseURL: 'http://localhost:4000/compra'
});

export const setCompra = async (compra) => {
    try {
        const response = await compraApi.post('/', compra);
        return response;
    } catch (error) {
        return { message: 'Error al registrar la compra', error };
    }
}

export const getCompra = async (codCompra) => {
    try {
        const response = await compraApi.get(`/${codCompra}`);
        return response;
    } catch (error) {
        return { error: error.response ? error.response.data : 'Error desconocido' }
    }
}

export const getCompras = async (fecha1, fecha2) => {
    try {
        const parametros = (fecha1 && fecha2) ? `?fecha1=${fecha1}&&fecha2=${fecha2}` : '';
        const { data } = await compraApi.get(`/${parametros}`);
        return data;
    } catch (error) {
        return { error }
    }
}