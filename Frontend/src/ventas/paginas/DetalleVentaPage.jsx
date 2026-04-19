import { useNavigate, useParams } from "react-router-dom"
import { getVenta } from "../../api/ventaApi";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { ItemVenta } from "../componentes/ItemVenta";
import { getCompra } from "../../api/compraApi";


export const DetalleVentaPage = () => {

    const [detalle, setDetalle] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { type, cod } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!type || !cod) {
            navigate('/');
        }
    }, [type, cod, navigate]);

    useEffect(() => {
        const obtenerDetalle = async () => {
            let data = [];
            if (type === 'compras') {
                ({ data } = await getCompra(cod));
            } else if (type === 'ventas') {
                ({ data } = await getVenta(cod));
            }
            if (data && data.error) {
                setMensaje(data.error)
                return;
            } else {
                setDetalle(data);
            }
            setIsLoading(false);
        }
        obtenerDetalle();
    }, [type, cod]);

    if (isLoading) {
        return (<Grid>Cargando informacion de la venta... </Grid>)
    }


    return (
        < div className="contenedor " >
            {console.log(detalle)}
            <div className="containerDetalleVenta ">
                <div className="detalleVentacabecera">
                    <div className="cabeceraSuperior">
                        <p>Factura N: <b>{detalle.codVenta || detalle.codCompra}</b></p>
                        <p>Fecha: <b>{detalle?.fecha}</b></p>
                    </div>
                    <div className="cabeceraMedia">
                        <div className="cabeceraMediaBox2">
                            <div>
                                <img src="/img/logo.jpeg" alt="Logo PuntoVet" />
                            </div>
                        </div>
                        <div className="cabeceraMediaBox1">
                            <h2>PuntoVet</h2>
                            <p>C.U.I.T: 20-75414787-8</p>
                            <p>Telefono: 3794-409720</p>
                        </div>
                    </div>
                    <div className="cabeceraInferior">
                        {(detalle.tipo_pago?.nombreTipoPago) ? <p>TipoPago: <b>{detalle.tipo_pago?.nombreTipoPago}</b> Recargo: {detalle?.tipo_pago.recargo}%</p> : 'No se proporciona informacion acerca del tipo de pago'}
                        <p>Generado por: <b>{detalle.usuario?.nombreApellido}</b></p>
                    </div>
                </div>
                <div className="medio">
                    {
                        (detalle?.venta_detalles || detalle?.compra_detalles).map((item) => (
                            <ItemVenta key={item.codProducto} detalle={item} />
                        ))
                    }
                </div>
                <div className="detalleVentaFooter">
                    <p>Monto Total: $ <b>{detalle?.montoTotal}</b></p>
                    <hr />
                    <p>Direccion: Av. Raul Alfonsin 5278 - Av. Tucuman 305 </p>
                </div>
            </div>
        </div >
    )
}