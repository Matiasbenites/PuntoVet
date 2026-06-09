import { useLocation, useNavigate, useParams } from "react-router-dom"
import { getVenta } from "../../api/ventaApi";
import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { ItemVenta } from "../componentes/ItemVenta";
import { getCompra } from "../../api/compraApi";

const formatFecha = (fechaString) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) return fechaString;
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
    const anio = fecha.getUTCFullYear();
    return `${dia}/${mes}/${anio}`;
};

export const DetalleVentaPage = () => {

    const [detalle, setDetalle] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { type: tipoParam, cod, codVenta } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const type = tipoParam || (location.pathname.startsWith('/compras') ? 'compras' : 'ventas');
    const codigo = cod || codVenta;

    useEffect(() => {
        if (!type || !codigo) {
            navigate('/');
        }
    }, [type, codigo, navigate]);

    useEffect(() => {
        const obtenerDetalle = async () => {
            try {
                let data = null;
                if (type === 'compras') {
                    data = await getCompra(codigo);
                } else if (type === 'ventas') {
                    data = await getVenta(codigo);
                }
                setDetalle(data);
            } catch (error) {
                setMensaje(error.message || 'No se pudo obtener el detalle.');
            } finally {
                setIsLoading(false);
            }
        }
        obtenerDetalle();
    }, [type, codigo]);

    if (isLoading) {
        return (<Grid>Cargando informacion de la venta... </Grid>)
    }

    if (mensaje) {
        return (<Grid>{mensaje}</Grid>)
    }

    const items = detalle?.venta_detalles || detalle?.compra_detalles || [];
    const tipoPago = detalle?.tipo_pago?.nombreTipoPago || 'Sin tipo';
    const recargo = detalle?.tipo_pago?.recargo ?? 0;

    return (
        <div className="paginaFactura">
            <div className="containerDetalleVenta">
                <div className="facturaHeader">
                    <div className="facturaNumber">
                        <p>Factura N:</p>
                        <h1>{detalle.codVenta || detalle.codCompra}</h1>
                    </div>
                    <div className="facturaDate">
                        <p>Fecha</p>
                        <h2>{formatFecha(detalle?.fecha)}</h2>
                    </div>
                </div>

                <div className="facturaBrand">
                    <div className="facturaLogo">
                        <img src="/img/logo.png" alt="Logo PuntoVet" />
                    </div>
                    <div className="facturaInfo">
                        <h2>PUNTO VET</h2>
                        <p>C.U.I.T: 20-75414787-8</p>
                        <p>Telefono: 3794-409720</p>
                    </div>
                </div>

                <div className="facturaMeta">
                    <div>
                        <span>TipoPago:</span>
                        <strong>{tipoPago}</strong>
                    </div>
                    <div>
                        <span>Recargo:</span>
                        <strong>{recargo}%</strong>
                    </div>
                    <div>
                        <span>Generado por:</span>
                        <strong>{detalle.usuario?.nombreApellido || 'Usuario'}</strong>
                    </div>
                </div>

                <div className="facturaItemsHeader">
                    <span>Producto</span>
                    <span>Precio</span>
                    <span>Cantidad</span>
                    <span>SubTotal</span>
                </div>
                <div className="facturaItems">
                    {items.map((item) => (
                        <ItemVenta key={`${item.codProducto}-${item.tipoVenta}-${item.subTotal}`} detalle={item} />
                    ))}
                </div>

                <div className="detalleVentaFooter">
                    <div className="footerRow">
                        <p>Monto Total:</p>
                        <strong>$ {Number(detalle?.montoTotal || 0).toFixed(2)}</strong>
                    </div>
                    <p className="footerAddress">Direccion: Av. Raul Alfonsin 5278 - Av. Tucuman 305</p>
                </div>
            </div>
        </div>
    );
}
