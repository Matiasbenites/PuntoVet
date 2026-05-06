import { Grid } from "@mui/material";
import { DatosCategoria, DatosMascota, DatosPrecio, DatosPrincipal, FinNuevoProducto } from "./";
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";

import { CardProducto } from "../componentes/CardProducto";
import { getProducto } from "../../api/productos/productosApi";
import { ContenedorFormulariosPrincipales } from "../../layout/ContenedorFormulariosPrincipales";
import { TituloFormularioPrincipales } from "../../componentes";

export const NuevoProducto = ({ producto }) => {
    // Contenedor principal del formulario multi-paso para crear o editar productos.
    // Maneja los 4 pasos: datos principales, categoría, mascotas, y precios.
    // Si se abre para editar, carga los datos del producto existente.
    // Muestra una preview del producto mientras se llena el formulario.
    const [nuevoProducto, setNuevoProducto] = useState({
        codProducto: '',
        nombre: '',
        descripcion: '',
        codCategoria: '',
        stock: '',
        peso: '',
        cantidad: '',
        codTamanio: '',
        mililitro: '',
        codMascotas: '',
        codEdades: '',
        precioCompra: '',
        precioVenta: '',
        precioSuelto: '',
        imagen: {}
    });
    const [progreso, setProgreso] = useState(0)
    const theme = useTheme();
    const { root } = theme;
    const location = useLocation();
    const codProducto = location.state?.codProducto;
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const cargarProducto = async () => {
            if (codProducto) {
                const datosProducto = await getProducto(codProducto);
                setNuevoProducto(datosProducto);
                setLoading(false);
            } else {
                setLoading(false)
            }
        };
        cargarProducto();
    }, [codProducto]);

    useEffect(() => {
        if (producto) {
            setNuevoProducto(producto)
        }
    }, [producto])


    if (loading) {
        return <div> Cargando wey.... </div>
    }


    return (
        <ContenedorFormulariosPrincipales>
            <TituloFormularioPrincipales titulo={`Nuevo Producto | Progreso ${progreso} / 3`} />
            <Grid container spacing={1} sx={{ padding: '1.5rem', placeItems: 'center', minHeight: '60vh' }}>
                <Grid item sm={8}>
                    <Routes>
                        <Route path="" element={<DatosPrincipal nuevoProducto={nuevoProducto} setNuevoProducto={setNuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                        <Route path="1" element={<DatosCategoria nuevoProducto={nuevoProducto} setNuevoProducto={setNuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                        <Route path="2" element={<DatosMascota nuevoProducto={nuevoProducto} setNuevoProducto={setNuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                        <Route path="3" element={<DatosPrecio nuevoProducto={nuevoProducto} setNuevoProducto={setNuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                        <Route path="4" element={<FinNuevoProducto nuevoProducto={nuevoProducto} setNuevoProducto={setNuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                    </Routes>
                </Grid>
                <Grid item sm={4}>
                    <CardProducto nuevoProducto={nuevoProducto} />
                </Grid>
            </Grid>
        </ContenedorFormulariosPrincipales>
    )
}