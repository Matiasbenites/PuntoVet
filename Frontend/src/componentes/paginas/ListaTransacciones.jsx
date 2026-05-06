import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getVentas } from "../../api/ventaApi";
import { Box, Container, Grid, Typography } from "@mui/material";
import { SectionHeader } from "../SectionHeader";
import { BuscadorGeneral } from "../BuscadorPersonalizado";
import { FiltroCalendario } from "../varios/FiltroCalendario";
import { ItemListaTransacciones } from "./ItemListaTransacciones";
import { getCompras } from "../../api/compraApi";


export const ListaTransacciones = () => {
    const [lista, setLista] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const location = useLocation();
    const { type } = location.state

    useEffect(() => {
        const obtenerLista = async (fechaInicio = null, fechaFin = null) => {
            let data = [];
            if (type === 'compras') {
                (data = await getCompras(fechaInicio, fechaFin))
            } else if (type === 'ventas') {
                (data = await getVentas(fechaInicio, fechaFin));
            }
            if (data && data.error) {
                console.log('ERrroS'); return
            } else {
                setLista(data);
            }
            setIsLoading(false)
        }
        obtenerLista();
    }, [type])

    const filtroFecha = async (fechaInicio, fechaFin) => {
        console.log(fechaFin, fechaInicio);
        setIsLoading(true);
        if (fechaInicio && fechaFin) {
            await obtenerLista(fechaInicio, fechaFin)
        }
    }

    if (isLoading) {
        return <Typography>Cargando Datos... </Typography>
    }
    const onLista = ({ data }) => {
        if (!data) {
            return;
        }
        setLista([data]);
    }

    return (
        <Container>
            <SectionHeader>
                <BuscadorGeneral onData={onLista} parametro={`${type}`} />
                <Grid>
                    <FiltroCalendario onUseFecha={filtroFecha} />
                </Grid>
            </SectionHeader>
            <Box component={'main'}>
                <div className="scroll">
                    {
                        lista.length > 0 && lista.map((item) => (<ItemListaTransacciones key={item?.codVenta || item?.codCompra} type={type} detalle={item} />))
                    }
                </div>
            </Box>
        </Container>

    )
}