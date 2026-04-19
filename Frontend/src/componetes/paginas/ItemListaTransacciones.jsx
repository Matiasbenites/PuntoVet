import { Box, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


export const ItemListaTransacciones = ({ detalle, type }) => {
    const { fecha, montoTotal } = detalle
    const cod = detalle.codVenta || detalle.codCompra
    const navigate = useNavigate();

    return (
        <Box component={'div'} onClick={() => navigate(`/${type}/detalle/${cod}`)}>
            <Grid container sx={{
                justifyContent: 'space-between',
                padding: '.5rem 3rem',
                backgroundColor: '#D9D9D9',
                marginTop: '.5rem',
                borderRadius: '1.5rem',
                padding: '.5rem 1rem',
                fontWeight: 'bold',
                alignItems: 'center',
                fontSize: '1.7rem'
            }}>
                <Grid item sm={4}>
                    <Typography variant="span">#: </Typography>
                    <Typography color={'#008512'} variant="span">{cod}</Typography>
                </Grid>
                <Grid item sm={4}>
                    <Typography variant="span">Fecha: </Typography>
                    <Typography color={'#008512'} variant="span"> {fecha}</Typography>
                </Grid>
                <Grid item sm={4}>
                    <Typography variant="span">MontoTotal: </Typography>
                    <Typography color={'#008512'} variant="span">$ {montoTotal}</Typography>
                </Grid>
            </Grid>
        </Box >
    )
}