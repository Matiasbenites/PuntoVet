import { Grid } from "@mui/material";
import { DatosCategoria, DatosMascota, DatosPrecio, DatosPrincipal, FinNuevoProducto } from "./";
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { CardProducto } from "../componentes/CardProducto";
import { getProducto } from "../../api/productos/productosApi";
import { ContenedorFormulariosPrincipales } from "../../layout/ContenedorFormulariosPrincipales";
import { TituloFormularioPrincipales } from "../../componentes";
import { useCrearProducto } from "../../hook/useCrearProducto";

export const NuevoProducto = () => {
    const { useCase, producto: nuevoProducto, pasoActual: progreso } = useCrearProducto();
    const setNuevoProducto = (datos) => useCase.actualizarProducto(datos);
    const setProgreso = (paso) => useCase.setPasoActual(paso);
    const location = useLocation();
    const codProducto = location.state?.codProducto;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProducto = async () => {
            if (codProducto) {
                const datosProducto = await getProducto(codProducto);
                useCase.cargarProducto(datosProducto);
                setLoading(false);
            } else {
                setLoading(false);
            }
        };
        cargarProducto();
    }, [codProducto, useCase]);


    if (loading) {
        return <div> Cargando wey.... </div>
    }


    return (
        <ContenedorFormulariosPrincipales>
            <TituloFormularioPrincipales titulo={`Nuevo Producto | Progreso ${progreso} / 3`} />
            <Grid container spacing={1} sx={{ padding: '1.5rem', placeItems: 'center', minHeight: '60vh' }}>
                <Grid item sm={8}>
                    <Routes>
                        <Route path="" element={<DatosPrincipal useCase={useCase} nuevoProducto={nuevoProducto} setNuevoProducto={setNuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                        <Route path="1" element={<DatosCategoria useCase={useCase} nuevoProducto={nuevoProducto} setNuevoProducto={setNuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                        <Route path="2" element={<DatosMascota useCase={useCase} nuevoProducto={nuevoProducto} setNuevoProducto={setNuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                        <Route path="3" element={<DatosPrecio useCase={useCase} nuevoProducto={nuevoProducto} setNuevoProducto={setNuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                        <Route path="4" element={<FinNuevoProducto useCase={useCase} nuevoProducto={nuevoProducto} setNuevoProducto={setNuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                    </Routes>
                </Grid>
                <Grid item sm={4}>
                    <CardProducto nuevoProducto={nuevoProducto} />
                </Grid>
            </Grid>
        </ContenedorFormulariosPrincipales>
    )
}