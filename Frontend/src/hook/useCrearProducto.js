import { useEffect, useState } from 'react';
import { CrearProductoUseCase } from '../useCases/CrearProductoUseCase';
import { ValidadorService } from '../services/ValidadorService';
import { ProductosServiceAdapter, CatalogosServiceAdapter } from '../services/ServicesAdapter';

/**
 * Hook de React que encapsula la lógica del useCase CrearProductoUseCase.
 * Este es el puente entre React y la lógica de negocio independiente del framework.
 * 
 * Retorna:
 * - useCase: La instancia del useCase (contiene toda la lógica de negocio)
 * - producto: El estado actual del producto
 * - pasoActual: El paso actual del flujo
 * - errores: Los errores de validación del paso anterior
 */
export const useCrearProducto = () => {
    const [useCase] = useState(() => {
        const validadorService = new ValidadorService();
        const productosService = new ProductosServiceAdapter();
        const catalogosService = new CatalogosServiceAdapter();
        
        return new CrearProductoUseCase(productosService, catalogosService, validadorService);
    });

    const [producto, setProducto] = useState(useCase.obtenerProducto());
    const [pasoActual, setPasoActual] = useState(useCase.getPasoActual());
    const [errores, setErrores] = useState([]);

    useEffect(() => {
        // Suscribirse a cambios del useCase
        const handleProductoActualizado = (datosProducto) => {
            setProducto(datosProducto);
            setErrores([]); // Limpiar errores cuando se actualiza el producto
        };

        const handlePasoAvanzado = (nuevoPaso) => {
            setPasoActual(nuevoPaso);
            setErrores([]);
        };

        const handlePasoRetrocedido = (nuevoPaso) => {
            setPasoActual(nuevoPaso);
            setErrores([]);
        };

        const handleErrores = (erroresValidacion) => {
            setErrores(erroresValidacion);
        };

        useCase.suscribir('productoActualizado', handleProductoActualizado);
        useCase.suscribir('pasoAvanzado', handlePasoAvanzado);
        useCase.suscribir('pasoRetrocedido', handlePasoRetrocedido);
        useCase.suscribir('erroresValidacion', handleErrores);

        // Cleanup
        return () => {
            useCase.desuscribir('productoActualizado', handleProductoActualizado);
            useCase.desuscribir('pasoAvanzado', handlePasoAvanzado);
            useCase.desuscribir('pasoRetrocedido', handlePasoRetrocedido);
            useCase.desuscribir('erroresValidacion', handleErrores);
        };
    }, [useCase]);

    return {
        useCase,
        producto,
        pasoActual,
        errores
    };
};
