import axios from "axios";



export const productosApi = axios.create({
    baseURL: 'http://localhost:4000',
});

export const getProductos = async (page = 10, limite, productoEstado, busqueda = '') => {
    // Pide la lista de productos paginada al backend.
    // Usa página, límite, estado y búsqueda para mostrar la lista en la UI.
    try {
        const { data } = await productosApi.get(`/productos?limite=${limite}&pagina=${page}&v_estado=${productoEstado}&busqueda=${busqueda}`);
        console.log(data);
        return data;

    } catch (error) {
        return error
    }
};

export const getProducto = async (codProducto = 1) => {
    // Recupera un solo producto por su código.
    // Esto se usa cuando se necesita editar un producto existente.
    try {
        const { data } = await productosApi.get(`/productos/${codProducto}`);
        return data;
    } catch (error) {
        return { message: 'Error al obtener el producto', error }
    }
}

export const getProductosFilter = async (busqueda = '', productoEstado = false) => {
    // Filtra productos por búsqueda y estado.
    try {
        const { data } = await productosApi.get(`/productos/filtro?busqueda=${busqueda}&v_estado=${productoEstado}`)
        return data;
    } catch (error) {
        return { message: 'Error al filtrar el producto', error }
    }
}

const subirImagen = async (imagen) => {
    const formData = new FormData();
    formData.append('imagen', imagen);

    try {
        const responce = await productosApi.post('/storage', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        return responce.data;
    } catch (error) {
        throw new Error(`Error al cargar la imagen: ${error}`);
    }
};

export const setProducto = async (nuevoProducto) => {
    const productoPayload = { ...nuevoProducto };
    delete productoPayload.codProducto;

    try {
        if (productoPayload.imagen instanceof File) {
            productoPayload.imagen = await subirImagen(productoPayload.imagen);
        }

        const responce = await productosApi.post('/productos', productoPayload);
        return responce.data.message;
    } catch (error) {
        throw new Error(error.message || 'Error al crear el producto');
    }
};

export const updateProducto = async (nuevoProducto) => {
    const productoPayload = { ...nuevoProducto };

    try {
        if (productoPayload.imagen instanceof File) {
            productoPayload.imagen = await subirImagen(productoPayload.imagen);
        }

        const responce = await productosApi.put(`/productos/${productoPayload.codProducto}`, productoPayload)
        return responce.data.message;
    } catch (error) {
        throw new Error(error.message || `Error al actualizar el producto ${productoPayload.codProducto}`);
    }
}

export const deleteProducto = async (codProducto) => {
    // Pide al backend que cambie el estado del producto.
    // El backend decide si marca el producto como eliminado o lo restaura.
    try {
        const responce = await productosApi.delete(`/productos/${codProducto}`)
        return responce.data
    } catch (error) {
        return { message: 'Ocurrio un error al eliminar el producto', error }
    }
}


