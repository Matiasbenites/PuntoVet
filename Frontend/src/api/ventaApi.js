import axios from "axios";


export const ventaApi = axios.create({
    baseURL: 'http://localhost:4000'
})

export const setNuevaVenta = async (venta) => {
    try {
        const response = ventaApi.post('/venta', venta);
        console.log(response);
        return response;
    } catch (error) {
        return { message: 'Error al registrar la venta', error }
    }
}

export const getVenta = async (codVenta) => {
    try {
        const response = await ventaApi.get(`/venta/${codVenta}`);
        return response;
    } catch (error) {
        return { error: error.response ? error.response.data : 'Error desconocido' }
    }
}

export const getVentas = async (fecha1, fecha2) => {
    try {
        const parametros = (fecha1 && fecha2) ? `?fecha1=${fecha1}&&fecha2=${fecha2}` : '';
        const { data } = await ventaApi.get(`/venta${parametros}`);
        return data;
    } catch (error) {
        return { error }
    }
}