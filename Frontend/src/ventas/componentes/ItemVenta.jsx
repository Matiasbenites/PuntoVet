import { Button, Grid, Typography } from "@mui/material";
import { HighlightOffSharp } from "@mui/icons-material";

export const ItemVenta = ({ producto = null, detalle = null, onQuitarProductoCarrito }) => {

    const {
        codProducto,
        nombre,
        nombreMascotas,
        nombreEdades,
        opcionVenta,
        tipoVenta,
        precioUnitario: precio,
        subTotal,
        cantidad,
        precioCompra
    } = producto || detalle || {};

    const nombreProducto = producto ? nombre : detalle?.producto?.nombre;



    const handleEliminarProducto = () => onQuitarProductoCarrito(codProducto)

    return (
        <Grid container sx={{
            backgroundColor: '#D9D9D9',
            marginTop: '.5rem',
            borderRadius: '1.5rem',
            padding: '.5rem 1rem',
            fontWeight: 'bold',
            alignItems: 'center',
            fontSize: '1.7rem',
            border: 'solid 1px'
        }}>
            <Grid item container alignItems={'center'} sm={(producto ? 11 : 12)}>
                <Grid item sx={{ display: 'flex', gap: '.5rem' }}>
                    <Typography variant="span" color={"#008512"}>{codProducto} || {nombreProducto} </Typography>
                    {
                        (producto) && (
                            <Typography variant="span" color={"#000000"}>|| Para: {nombreMascotas}  {nombreEdades}</Typography>
                        )
                    }
                </Grid>

                <Grid item sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                    <Grid item sx={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                        <Typography>Precio: </Typography>
                        <Typography variant="span" color={"#008512"}>{precio || precioCompra}</Typography>
                    </Grid>

                    <Grid item sx={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                        <Typography>Cantidad: </Typography>
                        <Typography variant="span" color={"#008512"}>{cantidad} {(tipoVenta != null) ? ((tipoVenta === 3) ? 'Uds' : 'Kg') : 'Uds'}  </Typography>
                    </Grid>
                    <Grid item sx={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                        <Typography>SubTotal: </Typography>
                        <Typography variant="span" color={"#008512"}>{Number(subTotal).toFixed(2)}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            {
                (producto) && (
                    <Grid item sm={1} sx={{ display: 'flex', justifyContent: 'right' }} >
                        <Button onClick={handleEliminarProducto}  ><HighlightOffSharp sx={{ color: 'red', }} /></Button>
                    </Grid>
                )
            }
        </Grid >
    )
}

