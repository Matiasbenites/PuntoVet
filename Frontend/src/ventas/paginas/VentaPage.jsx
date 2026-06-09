import { Box, Container, Grid } from "@mui/material";
import { BuscadorProductos, ButonVerde, SectionHeader } from "../../componentes";
import { useState } from "react";
import { ItemProductoMinimisado } from "../../componentes/varios/ItemProductoMinimisado";
import { ItemVenta } from "../componentes/ItemVenta";
import { ModalInput } from "../componentes/ModalInput";
import { CardPago } from "../../componentes/varios/CardPago";
import { useSelector } from "react-redux";
import { setNuevaVenta } from "../../api/ventaApi";
import { useNavigate } from "react-router-dom";
import { LoadingPage } from "../../componentes/animaciones/LoadingPage";
import { SelectorTipoPago } from "../../componentes/SelectorTipoPago";
import { useCarrito, useProductos, useSeleccionarOpcionPago } from "../hooks/index";
import { ComponenteCarrito } from "../componentes/Carrito";
import { BuscadorProductosDesplegable } from "../componentes/BuscadorProductoDespegable";
import { ROLES, usuarioTieneRol } from "../../router/roles";

const estiloSelectMetodoPago = {
    minWidth: '30rem',
}

export const VentaPage = () => {

    const navigate = useNavigate();
    const usuario = useSelector(state => state.auth.usuario)
    const { codUsuario } = usuario;
    const esAdministrador = usuarioTieneRol(usuario, [ROLES.ADMINISTRADOR]);

    const { opcionPago, recargo, seleccionOpcionPago } = useSeleccionarOpcionPago();
    const { productos, productoSeleccionado, openModal, buscarProducto, closeModal, listarProductos } = useProductos()
    const { carrito, montoTotal, montoFinal, montoRecargo, addCarrito, onQuitarProductoCarrito } = useCarrito(recargo, productoSeleccionado);

    const [showLoadingPage, setShowLoadingPage] = useState(false);

    const showLoadingPageFuction = () => setShowLoadingPage(true);

    // CU: Realizar Venta | Tabla 33 | Fig 12 | Contrato Tabla 27
    // Pre: carrito no vacío, tipo de pago seleccionado, usuario autenticado.
    // Post: venta enviada al backend; si tiene éxito navega al detalle (recibo).
    // Validaciones CP2/CP3 de Tabla 33 se resuelven aquí antes de llegar al backend.
    const finalizarCompra = async () => {
        if (!codUsuario) {
            alert('No se encontro un usuario activo para registrar la venta.');
            return;
        }

        if (!opcionPago) {
            alert('Debe seleccionar un metodo de pago.');
            return;
        }

        if (carrito.length === 0) {
            alert('Debe agregar al menos un producto al carrito.');
            return;
        }

        const detalleVenta = carrito.map((item) => ({
            codProducto: item.codProducto,
            cantidad: Number(item.cantidad),
            tipoVenta: Number(item.tipoVenta)
        }));
        const venta = {
            opcionPago: Number(opcionPago),
            codUsuario: Number(codUsuario),
            detalleVenta
        };
        showLoadingPageFuction();

        try {
            const data = await setNuevaVenta(venta);
            const { codVentaGenerada } = data;
            navigate(`/ventas/detalle/${codVentaGenerada}`);
        } catch (error) {
            console.error('Error al registrar venta:', error);
            setShowLoadingPage(false);
            const detalle = error.errors?.[0]?.msg || error.error || error.message || 'No se pudo registrar la venta.';
            alert(detalle);
        }
    }

    return (
        <Container sx={{ position: 'relative' }}>
            {(showLoadingPage) && <LoadingPage show={showLoadingPage} />}
            <SectionHeader>
                <BuscadorProductos onProductosObtenidos={listarProductos} />
                <SelectorTipoPago onSelect={seleccionOpcionPago} estilo={estiloSelectMetodoPago} />
                {esAdministrador && <ButonVerde onClick={() => navigate('/ventas/lista')}>Ventas</ButonVerde>}
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
                textoBoton="Finalizar Venta"
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
