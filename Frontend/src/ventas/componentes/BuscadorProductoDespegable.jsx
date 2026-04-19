import { Box } from "@mui/material";
import { ItemProductoMinimisado } from "../../componetes/varios/ItemProductoMinimisado";


export const BuscadorProductosDesplegable = ({ productos, buscarProducto }) => {
    return (
        productos.length >= 1 ?
            <Box sx={{ position: 'absolute', width: '100%', backgroundColor: '#576f73', padding: '1rem', zIndex: '10', top: '8rem', borderRadius: '0 0 1.5rem 1.5rem' }}>
                {
                    productos && productos.map((producto, index) => {
                        return (
                            <ItemProductoMinimisado
                                key={producto.codProducto}
                                productos={producto}
                                onCodProducto={buscarProducto}
                            />
                        );
                    })
                }
            </Box>
            : null
    )
}