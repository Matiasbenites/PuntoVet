import { Grid } from "@mui/material";
import { DatosCategoria, DatosMascota, DatosPrecio, DatosPrincipal, FinNuevoProducto } from "./";
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { CardProducto } from "../componentes/CardProducto";
import { getProducto } from "../../api/productos/productosApi";
import { ContenedorFormulariosPrincipales } from "../../layout/ContenedorFormulariosPrincipales";
import { TituloFormularioPrincipales } from "../../componentes";
import { CrearProductoUseCase } from "../../useCases/CrearProductoUseCase";
import { ValidadorService } from "../../services/ValidadorService";
import { ProductosServiceAdapter, CatalogosServiceAdapter } from "../../services/ServicesAdapter";

export const NuevoProducto = () => {
    // Contenedor principal del formulario multi-paso para crear o editar productos.
    // Maneja los 4 pasos: datos principales, categoría, mascotas, y precios.
    // Si se abre para editar, carga los datos del producto existente.
    // Muestra una preview del producto mientras se llena el formulario.
    const [useCase] = useState(() => {
        const validadorService = new ValidadorService();
        const productosService = new ProductosServiceAdapter();
        const catalogosService = new CatalogosServiceAdapter();
        return new CrearProductoUseCase(productosService, catalogosService, validadorService);
    });
    const [nuevoProducto, setNuevoProducto] = useState(useCase.obtenerProducto());
    const [progreso, setProgreso] = useState(useCase.getPasoActual());
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

    useEffect(() => {
        const handleProductoActualizado = (datosProducto) => {
            setNuevoProducto(datosProducto);
        };

        const handlePasoAvanzado = (nuevoPaso) => {
            setProgreso(nuevoPaso);
        };

        const handlePasoRetrocedido = (nuevoPaso) => {
            setProgreso(nuevoPaso);
        };

        useCase.suscribir('productoActualizado', handleProductoActualizado);
        useCase.suscribir('pasoAvanzado', handlePasoAvanzado);
        useCase.suscribir('pasoRetrocedido', handlePasoRetrocedido);

        return () => {
            useCase.desuscribir('productoActualizado', handleProductoActualizado);
            useCase.desuscribir('pasoAvanzado', handlePasoAvanzado);
            useCase.desuscribir('pasoRetrocedido', handlePasoRetrocedido);
        };
    }, [useCase]);


    if (loading) {
        return <div> Cargando wey.... </div>
    }


    return (
        <ContenedorFormulariosPrincipales>
            <TituloFormularioPrincipales titulo={`Nuevo Producto | Progreso ${progreso} / 3`} />
            <Grid container spacing={1} sx={{ padding: '1.5rem', placeItems: 'center', minHeight: '60vh' }}>
                <Grid item sm={8}>
                    <Routes>
                        <Route path="" element={<DatosPrincipal useCase={useCase} nuevoProducto={nuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                        <Route path="1" element={<DatosCategoria useCase={useCase} nuevoProducto={nuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                        <Route path="2" element={<DatosMascota useCase={useCase} nuevoProducto={nuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                        <Route path="3" element={<DatosPrecio useCase={useCase} nuevoProducto={nuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                        <Route path="4" element={<FinNuevoProducto useCase={useCase} nuevoProducto={nuevoProducto} progreso={progreso} setProgreso={setProgreso} />} />
                    </Routes>
                </Grid>
                <Grid item sm={4}>
                    <CardProducto nuevoProducto={nuevoProducto} />
                </Grid>
            </Grid>
        </ContenedorFormulariosPrincipales>
    )
}