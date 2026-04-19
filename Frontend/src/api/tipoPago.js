import axios from "axios";

export const tipoPagoApi = axios.create({
    baseURL: 'http://localhost:4000/tipoPago'
})

export const getTiposPagos = async () => {
    try {
        const response = await tipoPagoApi.get('/');
        return response;
    } catch (error) {
        return { message: 'Error al obtener los tipos de pago', error }
    }
}