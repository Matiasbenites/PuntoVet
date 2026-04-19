import { useState } from "react"
import { getProducto } from "../../api/productos/productosApi";

export const useProductos = () => {
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const closeModal = () => setOpenModal(false);

    const buscarProducto = async (codProducto) => {
        try {
            const producto = await getProducto(codProducto);
            setProductoSeleccionado(producto)
            setOpenModal(true);
            setProductos([]);
        } catch (error) {

        }
    }

    const listarProductos = (productos) => setProductos(productos)

    return {
        productos,
        productoSeleccionado,
        openModal,
        buscarProducto,
        closeModal,
        listarProductos
    }
}