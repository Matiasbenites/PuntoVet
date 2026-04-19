import { useEffect, useState } from "react";
import { getProductos } from "../api/productos/productosApi";
import { getVenta, getVentas } from "../api/ventaApi";
import { Search } from "@mui/icons-material";
import { Box } from "@mui/material";



export const BuscadorGeneral = ({ onData, parametro }) => {
    const [busqueda, setBusqueda] = useState('');

    const selectorDeParametro = () => {
        switch (parametro) {
            case 'productos':
                return getProductos;
            case 'ventas':
                return getVenta;
            default:
                return null;
        }
    }

    useEffect(() => {
        const obtenerData = async () => {
            if (busqueda === '' || busqueda.length === 0) {
                onData([]);
                return;
            } else {
                const funcionBuscar = selectorDeParametro(parametro);
                if (funcionBuscar) {
                    try {
                        const response = await funcionBuscar(busqueda);
                        onData(response);
                    } catch (error) {
                        onData({ message: 'Error al obtener los productos', error });
                    }
                }
            }
        }
        obtenerData();
    }, [busqueda])

    const onBusqueda = (event) => {
        const busqueda = event.target.value;
        setBusqueda(busqueda);
    }

    return (
        <Box className="boxBuscar" >
            <Search />
            <input
                className="inputBuscar"
                onChange={onBusqueda}
                placeholder={`Buscar ${parametro}...`}
            />

        </Box>
    )

}