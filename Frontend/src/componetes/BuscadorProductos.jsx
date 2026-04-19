import { useEffect, useState } from "react";
import { getProductos } from "../api/productos/productosApi";
import { Box, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";



export const BuscadorProductos = ({ onProductosObtenidos }) => {
    const [busqueda, setBusqueda] = useState('');
    const [producto, setProducto] = useState('');


    useEffect(() => {
        const obtenerProductos = async () => {
            if (busqueda === '' || busqueda.length < 3) {
                onProductosObtenidos([]);
                return;
            } else {
                try {
                    const responce = await getProductos(1, 5, true, busqueda);
                    setProducto(responce);
                    onProductosObtenidos(responce);

                } catch (error) {
                    setProducto({ message: 'Error al obtener los productos', error });
                }
            }
        }
        obtenerProductos();
    }, [busqueda])

    const onBusqueda = (event) => {
        const busqueda = event.target.value;
        setBusqueda(busqueda);
    }


    return (
        <Box className="boxBuscar" >
            {/* <TextField onChange={onBusqueda} /> */}
            <Search />
            <input
                className="inputBuscar"
                onChange={onBusqueda}
                placeholder="Buscar un producto..."
            />

        </Box>
    )

}

