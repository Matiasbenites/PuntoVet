import { Box, Container, Grid, Typography } from "@mui/material"
import { SectionHeader } from "../../componetes/SectionHeader";
import { useEffect, useState } from "react";
import { getVentas } from "../../api/ventaApi";
import { ItemListaVentas } from "../componentes/ItemListaVenta";
import { FiltroCalendario } from "../../componetes/varios/FiltroCalendario";
import { BuscadorGeneral } from "../../componetes/BuscadorPersonalizado";


export const ListaVenta = () => {
    const [ventas, setVentas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const obtenerVentas = async () => {
            const responce = await getVentas();
            setVentas(responce);
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

    const onVentas = ({ data }) => {
        if (!data) {
            return;
        }
        setVentas([data]);
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