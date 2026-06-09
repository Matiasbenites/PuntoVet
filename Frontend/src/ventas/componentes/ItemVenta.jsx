import { Button, Grid, Typography } from "@mui/material";
import { HighlightOffSharp } from "@mui/icons-material";

export const ItemVenta = ({ producto = null, detalle = null, onQuitarProductoCarrito }) => {

    const {
        codProducto,
        nombre,
        nombreMascotas,
        nombreEdades,
        tipoVenta,
        precioUnitario: precio,
        subTotal,
        cantidad,
        precioCompra
    } = producto || detalle || {};

    const nombreProducto = producto ? nombre : detalle?.producto?.nombre;
    const precioFinal = Number(precio || precioCompra || 0).toFixed(2);
    const subTotalFinal = Number(subTotal || 0).toFixed(2);
    const unidad = (tipoVenta != null) ? ((tipoVenta === 3) ? 'Uds' : 'Kg') : 'Uds';
    const isDetalle = Boolean(detalle && !producto);

    const handleEliminarProducto = () => onQuitarProductoCarrito?.(codProducto)

    if (isDetalle) {
        return (
            <div className="facturaItemRow">
                <div className="facturaItemNombre">
                    <strong>{nombreProducto || 'Producto'}</strong>
                    <small>Cod: {codProducto}</small>
                </div>
                <div className="facturaItemCell">${precioFinal}</div>
                <div className="facturaItemCell">{cantidad} {unidad}</div>
                <div className="facturaItemCell">${subTotalFinal}</div>
            </div>
        );
    }

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
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                <Typography sx={{ fontSize: '1.85rem', fontWeight: 700, color: '#1D3C34' }}>{nombreProducto || 'Producto'}</Typography>
                <Typography sx={{ color: '#5A5A5A' }}>Cod: {codProducto}</Typography>
                <Typography sx={{ color: '#5A5A5A' }}>Para: {nombreMascotas} {nombreEdades}</Typography>
            </Grid>

            <Grid item xs={4} md={2} sx={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
                <Typography sx={{ color: '#5A5A5A' }}>Precio</Typography>
                <Typography sx={{ fontWeight: 700, color: '#008512' }}>${precioFinal}</Typography>
            </Grid>

            <Grid item xs={4} md={2} sx={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
                <Typography sx={{ color: '#5A5A5A' }}>Cantidad</Typography>
                <Typography sx={{ fontWeight: 700, color: '#008512' }}>{cantidad} {unidad}</Typography>
            </Grid>

            <Grid item xs={4} md={2} sx={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
                <Typography sx={{ color: '#5A5A5A' }}>SubTotal</Typography>
                <Typography sx={{ fontWeight: 700, color: '#008512' }}>${subTotalFinal}</Typography>
            </Grid>

            <Grid item md={1} sx={{ display: 'flex', justifyContent: 'right' }}>
                <Button onClick={handleEliminarProducto}><HighlightOffSharp sx={{ color: 'red' }} /></Button>
            </Grid>
        </Grid>
    )
}

