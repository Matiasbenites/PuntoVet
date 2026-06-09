import axios from "axios";

export const tipoPagoApi = axios.create({
    baseURL: 'http://localhost:4000/tipoPago',
    timeout: 15000
})

export const getTiposPagos = async () => {
    try {
        const response = await tipoPagoApi.get('/');
        return response;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener los tipos de pago', error }
    }
}
