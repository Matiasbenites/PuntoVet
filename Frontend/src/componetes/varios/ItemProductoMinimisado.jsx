import { Grid, Typography } from "@mui/material";




export const ItemProductoMinimisado = ({ productos, onCodProducto }) => {
    const { codProducto, nombre, stock, precioVenta, precioSuelto, nombreMascotas, nombreEdades } = productos;

    const obtenerCodigo = () => {
        onCodProducto(codProducto)
    }


    return (
        <Grid onClick={obtenerCodigo} container sx={{
            backgroundColor: '#D9D9D9',
            marginTop: '.5rem',
            borderRadius: '1.5rem',
            padding: '.5rem 1rem',
            fontWeight: 'bold'
        }}>
            <Grid item container justifyContent={'center'} alignItems={'center'}>
                <Grid item sm={5}>
                    <Grid sx={{ display: 'flex', gap: '.5rem' }}>
                        <Typography variant="span" color={"#008512"}>{codProducto} || {nombre}</Typography>
                    </Grid>
                    <Grid sx={{ display: 'flex', gap: '.5rem' }}>
                        <Grid sx={{ display: 'flex', gap: '.5rem' }}>
                            <Typography>Mascota: </Typography>
                            <Typography variant="span" color={"#008512"}>{nombreMascotas}</Typography>
                        </Grid>
                        <Grid sx={{ display: 'flex', gap: '.5rem' }}>
                            <Typography>Edad: </Typography>
                            <Typography variant="span" color={"#008512"}>{nombreEdades}</Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item sm={2} sx={{ display: 'flex', gap: '.5rem' }}>
                    <Typography>Stock: </Typography>
                    <Typography variant="span" color={"#008512"}>{stock}</Typography>
                </Grid>

                <Grid item sm={5} sx={{ display: 'flex', gap: '3rem' }}>
                    <Grid sx={{ display: 'flex', gap: '.5rem' }}>
                        <Typography>Precio Bolsa: </Typography>
                        <Typography variant="span" color={"#008512"}>{precioVenta}</Typography>
                    </Grid>
                    <Grid sx={{ display: 'flex', gap: '.5rem' }}>
                        <Typography>Precio Suelto: </Typography>
                        <Typography variant="span" color={"#008512"}>{precioSuelto}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid >
    );
}

