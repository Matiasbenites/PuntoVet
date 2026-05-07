import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Obtiene el listado de categorías desde el backend
 */
export const getCategoria = async () => {
    try {
        const response = await axios.get(`${API_URL}/categorias`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        // Fallback a datos hardcodeados en caso de error
        return [
            { codCategoria: 1, nombreCategoria: 'Balanceados' },
            { codCategoria: 2, nombreCategoria: 'Juguetes' },
            { codCategoria: 3, nombreCategoria: 'Medicamentos' },
            { codCategoria: 4, nombreCategoria: 'Accesorios' },
            { codCategoria: 5, nombreCategoria: 'Otros' }
        ];
    }
};

/**
 * Obtiene el listado de tamaños desde el backend
 */
export const getTamanio = async () => {
    try {
        const response = await axios.get(`${API_URL}/tamanios`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener tamaños:', error);
        // Fallback a datos hardcodeados en caso de error
        return [
            { codTamanio: 1, nombreTamanio: 'Chico' },
            { codTamanio: 2, nombreTamanio: 'Mediano' },
            { codTamanio: 3, nombreTamanio: 'Grande' }
        ];
    }
};

/**
 * Obtiene el listado de mascotas desde el backend
 */
export const getMascotas = async () => {
    try {
        const response = await axios.get(`${API_URL}/mascotas`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener mascotas:', error);
        // Fallback a datos hardcodeados en caso de error
        return [
            { codMascota: 1, nombreMascota: 'Perro' },
            { codMascota: 2, nombreMascota: 'Gato' },
            { codMascota: 3, nombreMascota: 'Ave' },
            { codMascota: 4, nombreMascota: 'Otros' }
        ];
    }
};

/**
 * Obtiene el listado de edades desde el backend
 */
export const getEdades = async () => {
    try {
        const response = await axios.get(`${API_URL}/edades`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener edades:', error);
        // Fallback a datos hardcodeados en caso de error
        return [
            { codEdad: 1, nombreEdad: 'Cachorro' },
            { codEdad: 2, nombreEdad: 'Castrado' },
            { codEdad: 3, nombreEdad: 'Joven' },
            { codEdad: 4, nombreEdad: 'Adulto' },
            { codEdad: 5, nombreEdad: 'Mayor' },
            { codEdad: 6, nombreEdad: 'Urinario' }
        ];
    }
};
