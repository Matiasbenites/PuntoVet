import { Container } from "@mui/material"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useCarrito, useProductos, useSeleccionarOpcionPago } from "../../ventas/hooks";
import { useState } from "react";
import { LoadingPage } from "../../componentes/animaciones/LoadingPage";
import { BuscadorProductos, ButonVerde, SectionHeader } from "../../componentes";
import { BuscadorProductosDesplegable } from "../../ventas/componentes/BuscadorProductoDespegable";
import { ComponenteCarrito } from "../../ventas/componentes/Carrito";
import { ModalInputCompra } from "../componentes/ModalInputCompra";
import { setCompra } from "../../api/compraApi";

const estiloSelectMetodoPago = {
    minWidth: '30rem',
}

export const CompraPage = () => {
    const navigate = useNavigate();
    const { codUsuario } = useSelector(state => state.auth.usuario);

    const { opcionPago, recargo, seleccionOpcionPago } = useSeleccionarOpcionPago();
    const { productos, productoSeleccionado, openModal, buscarProducto, closeModal, listarProductos } = useProductos()
    const { carrito, montoTotal, addCarrito, onQuitarProductoCarrito } = useCarrito(recargo, productoSeleccionado);

    const [showLoadingPage, setShowLoadingPage] = useState(false);

    const showLoadingPageFuction = () => setShowLoadingPage(true);

    const finalizarCompra = async () => {
        if (!codUsuario) {
            alert('No se encontro un usuario activo para registrar la compra.');
            return;
        }

        if (carrito.length === 0) {
            alert('Debe agregar al menos un producto al carrito.');
            return;
        }

        showLoadingPageFuction();
        const detalleCompra = carrito.map((item) => ({
            codProducto: item.codProducto,
            cantidad: Number(item.cantidad),
            precioCompra: item.precioCompra,
            precioVenta: item.precioVenta,
            precioSuelto: item.precioSuelto
        }));
        const compra = {
            codUsuario: Number(codUsuario),
            detalleCompra
        }

        try {
            const data = await setCompra(compra);
            const { codCompraCreada } = data
            navigate(`/compras/detalle/${codCompraCreada}`)
        } catch (error) {
            console.error('Error al registrar compra:', error);
            setShowLoadingPage(false);
            const detalle = error.error || error.message || 'No se pudo registrar la compra.';
            alert(detalle);
        }
    }

    return (
        <Container sx={{ position: 'relative' }}>
            {(showLoadingPage) && <LoadingPage show={showLoadingPage} />}
            <SectionHeader>
                <BuscadorProductos onProductosObtenidos={listarProductos} />
                <ButonVerde onClick={() => navigate('/compras/lista', { state: { type: 'compras' } })}>Compras</ButonVerde>
            </SectionHeader>
            <BuscadorProductosDesplegable
                productos={productos}
                opcionPago={opcionPago}
                buscarProducto={buscarProducto}
            />
            <ComponenteCarrito
                carrito={carrito}
                montoTotal={montoTotal}
                finalizarCompra={finalizarCompra}
                opcionPago={opcionPago}
                onQuitarProductoCarrito={onQuitarProductoCarrito}
                textoBoton="Finalizar Compra"
            />
            {
                productoSeleccionado &&
                <ModalInputCompra
                    producto={productoSeleccionado}
                    open={openModal}
                    handleClose={closeModal}
                    onProductoCarrito={addCarrito}
                />

            }
        </Container>
    )
}
