import { Box, Grid } from "@mui/material";
import { ItemVenta } from "./ItemVenta";
import { CardPago } from "../../componetes/varios/CardPago";
import { ButonVerde } from "../../componetes";


export const ComponenteCarrito = ({ carrito, montoTotal, montoFinal, montoRecargo, finalizarCompra, opcionPago, onQuitarProductoCarrito }) => {
    return (
        <Grid container spacing={1} justifyContent={'space-between'} >
            <Grid className="scroll" item sm={8} >
                <Box component={'section'} >
                    {
                        carrito && carrito.map((car) => {
                            return (
                                <ItemVenta
                                    key={car.codProducto}
                                    producto={car}
                                    tipoPago={opcionPago}
                                    onQuitarProductoCarrito={onQuitarProductoCarrito}
                                />
                            );
                        })
                    }
                </Box>
            </Grid>
            <Grid item sm={3.5} sx={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                <CardPago montoToal={montoTotal} montoFinal={montoFinal} montoRecargo={montoRecargo} />
                <ButonVerde
                    disabled={(carrito.length > 0) ? false : true}
                    onClick={finalizarCompra}
                >
                    Finalizar Venta
                </ButonVerde>
            </Grid>
        </Grid>
    )
}