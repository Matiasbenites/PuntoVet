import axios from "axios";



export const productosApi = axios.create({
    baseURL: 'http://localhost:4000',
});

export const getProductos = async (page = 10, limite, productoEstado, busqueda = '') => {
    // console.log('campo api: ', busqueda, 'Pagina: ', page, 'Limite: ', limite, 'Estado: ', productoEstado);
    try {
        const { data } = await productosApi.get(`/productos?limite=${limite}&pagina=${page}&v_estado=${productoEstado}&busqueda=${busqueda}`);
        console.log(data);
        return data;

    } catch (error) {
        return error
    }
};

export const getProducto = async (codProducto = 1) => {
    try {
        const { data } = await productosApi.get(`/productos/${codProducto}`);
        return data;
    } catch (error) {
        return { message: 'Error al obtener el producto', error }
    }
}

export const getProductosFilter = async () => {
    try {
        const { data } = await productosApi.get(`/productos/filtro?busqueda=${busqueda}&v_estado=${productoEstado}`)
        return data;
    } catch (error) {
        return { message: 'Error al filtrar el producto', error }
    }
}

const setImagen = async (dataImage) => {
    const formData = new FormData();
    formData.append('imagen', dataImage)
    try {
        const responce = await productosApi.post('/storage', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        return responce;
    } catch (error) {
        return { message: `Error al cargar la imagen: ${error}` }
    }
}

export const setProducto = async (nuevoProducto) => {
    delete nuevoProducto.codProducto;
    const datosImagen = nuevoProducto.imagen;
    try {
        const { data } = await setImagen(datosImagen);
        console.log('enlace de imagen: ', data);
        nuevoProducto.imagen = data;
        const responce = await productosApi.post('/productos', nuevoProducto);
        return responce.data.message;
    } catch (error) {
        return error
    }
};

export const updateProducto = async (nuevoProducto) => {
    const datosImagen = nuevoProducto.imagen;
    try {
        const { data } = await setImagen(datosImagen);
        console.log('enlace de imagen: ', data);
        nuevoProducto.imagen = data;

        const responce = await productosApi.put(`/productos/${nuevoProducto.codProducto}`, nuevoProducto)
        return responce.data.message;
    } catch (error) {
        return { message: `Error al actualizar el producto ${nuevoProducto.codProducto}`, error }
    }
}

export const deleteProducto = async (codProducto) => {
    try {
        const responce = await productosApi.delete(`/productos/${codProducto}`)
        return responce.data
    } catch (error) {
        return { message: 'Ocurrio un error al eliminar el producto', error }
    }
}


