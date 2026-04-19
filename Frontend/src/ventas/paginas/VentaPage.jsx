import { Box, Container, Grid } from "@mui/material";
import { BuscadorProductos, ButonVerde, SectionHeader } from "../../componetes";
import { useState } from "react";
import { ItemProductoMinimisado } from "../../componetes/varios/ItemProductoMinimisado";
import { ItemVenta } from "../componentes/ItemVenta";
import { ModalInput } from "../componentes/ModalInput";
import { CardPago } from "../../componetes/varios/CardPago";
import { useSelector } from "react-redux";
import { setNuevaVenta } from "../../api/ventaApi";
import { useNavigate } from "react-router-dom";
import { LoadingPage } from "../../componetes/animaciones/LoadingPage";
import { SelectorTipoPago } from "../../componetes/SelectorTipoPago";
import { useCarrito, useProductos, useSeleccionarOpcionPago } from "../hooks/index";
import { ComponenteCarrito } from "../componentes/Carrito";
import { BuscadorProductosDesplegable } from "../componentes/BuscadorProductoDespegable";

const estiloSelectMetodoPago = {
    minWidth: '30rem',
}

export const VentaPage = () => {

    const navigate = useNavigate();
    const { codUsuario } = useSelector(state => state.auth.usuario)

    const { opcionPago, recargo, seleccionOpcionPago } = useSeleccionarOpcionPago();
    const { productos, productoSeleccionado, openModal, buscarProducto, closeModal, listarProductos } = useProductos()
    const { carrito, montoTotal, montoFinal, montoRecargo, addCarrito, onQuitarProductoCarrito } = useCarrito(recargo, productoSeleccionado);

    const [showLoadingPage, setShowLoadingPage] = useState(false);

    const showLoadingPageFuction = () => setShowLoadingPage(true);

    const finalizarCompra = async () => {
        const detalleVenta = carrito.map((item) => ({
            codProducto: item.codProducto,
            cantidad: item.cantidad,
            tipoVenta: item.opcionVenta
        }))
        const venta = {
            opcionPago,
            codUsuario,
            detalleVenta
        }
        showLoadingPageFuction();
        const { data } = await setNuevaVenta(venta);
        const { codVentaGenerada } = data
        navigate(`/ventas/detalle/${codVentaGenerada}`)
    }

    return (
        <Container sx={{ position: 'relative' }}>
            {(showLoadingPage) && <LoadingPage show={showLoadingPage} />}
            <SectionHeader>
                <BuscadorProductos onProductosObtenidos={listarProductos} />
                <SelectorTipoPago onSelect={seleccionOpcionPago} estilo={estiloSelectMetodoPago} />
                <ButonVerde onClick={() => navigate('/ventas/lista')}>Ventas</ButonVerde>
            </SectionHeader>
            <BuscadorProductosDesplegable
                productos={productos}
                buscarProducto={buscarProducto}
            />
            <ComponenteCarrito
                carrito={carrito}
                montoTotal={montoTotal}
                montoFinal={montoFinal}
                montoRecargo={montoRecargo}
                finalizarCompra={finalizarCompra}
                opcionPago={opcionPago}
                onQuitarProductoCarrito={onQuitarProductoCarrito}
            />

            {
                productoSeleccionado &&
                <ModalInput open={openModal}
                    handleClose={closeModal}
                    producto={productoSeleccionado}
                    opcionPago={opcionPago}
                    onProductoCarrito={addCarrito}
                />
            }
        </Container >
    );
}