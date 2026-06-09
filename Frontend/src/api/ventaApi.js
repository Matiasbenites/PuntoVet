import axios from "axios";

export const ventaApi = axios.create({
    baseURL: 'http://localhost:4000',
    timeout: 15000
})

export const setNuevaVenta = async (venta) => {
    try {
        const response = await ventaApi.post('/venta', venta);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al registrar la venta. Verifique que el backend este levantado.', error };
    }
}

export const getVenta = async (codVenta) => {
    try {
        const response = await ventaApi.get(`/venta/${codVenta}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener la venta', error };
    }
}

export const getVentas = async (fecha1, fecha2) => {
    try {
        const parametros = (fecha1 && fecha2) ? `?fecha1=${fecha1}&fecha2=${fecha2}` : '';
        const response = await ventaApi.get(`/venta${parametros}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener las ventas', error };
    }
}
