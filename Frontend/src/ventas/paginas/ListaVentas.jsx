import { Box, Container, Grid, Typography } from "@mui/material"
import { SectionHeader } from "../../componentes/SectionHeader";
import { useEffect, useState } from "react";
import { getVentas } from "../../api/ventaApi";
import { ItemListaVentas } from "../componentes/ItemListaVenta";
import { FiltroCalendario } from "../../componentes/varios/FiltroCalendario";
import { BuscadorGeneral } from "../../componentes/BuscadorPersonalizado";


export const ListaVenta = () => {
    const [ventas, setVentas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const obtenerVentas = async () => {
            const response = await getVentas();
            setVentas(response);
            setIsLoading(false)
        }
        obtenerVentas();
    }, [])

    const filtroFecha = async (fechaInicio, fechaFin) => {
        if (fechaInicio && fechaFin) {
            const response = await getVentas(fechaInicio, fechaFin);
            setVentas(response)
        }
    }

    if (isLoading) {
        return <Typography>Cargando Datos... </Typography>
    }

    const onVentas = (resultado) => {
        if (!resultado) {
            return;
        }

        if (resultado.data) {
            setVentas([resultado.data]);
            return;
        }

        setVentas(Array.isArray(resultado) ? resultado : [resultado]);
    }

    return (
        <Container>
            <SectionHeader>
                <BuscadorGeneral onData={onVentas} parametro={'ventas'} />
                <Grid>
                    <FiltroCalendario onUseFecha={filtroFecha} />
                </Grid>
            </SectionHeader>
            <Box component={'main'}>
                <div className="scroll">
                    {
                        ventas.length > 0 && ventas.map((item) => (<ItemListaVentas key={item.codVenta} venta={item} />))
                    }
                </div>
            </Box>
        </Container>

    )
}