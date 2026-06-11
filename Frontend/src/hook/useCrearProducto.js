import { useEffect, useState } from 'react';
import { CrearProductoUseCase } from '../useCases/CrearProductoUseCase';
import { ValidadorService } from '../services/ValidadorService';
import { ProductosServiceAdapter, CatalogosServiceAdapter } from '../services/ServicesAdapter';

/**
 * Hook de React que encapsula la lógica del useCase CrearProductoUseCase.
 * Este es el puente entre React y la lógica de negocio independiente del framework.
 *
 * Suscripción al patrón Observer via eventemitter3:
 *   Antes: useCase.suscribir(evento, cb) / useCase.desuscribir(evento, cb)
 *          llamaban a métodos implementados manualmente en el useCase.
 *   Ahora: useCase.on(evento, cb) / useCase.off(evento, cb) son la API estándar
 *          de EventEmitter (eventemitter3), heredada directamente por CrearProductoUseCase.
 *          El comportamiento es el mismo; la diferencia es que la gestión de
 *          listeners la provee la librería, no código propio.
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
        const handleProductoActualizado = (datosProducto) => {
            setProducto(datosProducto);
            setErrores([]);
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

        // on() de eventemitter3 reemplaza el método suscribir() manual.
        // Antes: useCase.suscribir('productoActualizado', handleProductoActualizado)
        useCase.on('productoActualizado', handleProductoActualizado);
        useCase.on('pasoAvanzado', handlePasoAvanzado);
        useCase.on('pasoRetrocedido', handlePasoRetrocedido);
        useCase.on('erroresValidacion', handleErrores);

        return () => {
            // off() de eventemitter3 reemplaza el método desuscribir() manual.
            // Antes: useCase.desuscribir('productoActualizado', handleProductoActualizado)
            useCase.off('productoActualizado', handleProductoActualizado);
            useCase.off('pasoAvanzado', handlePasoAvanzado);
            useCase.off('pasoRetrocedido', handlePasoRetrocedido);
            useCase.off('erroresValidacion', handleErrores);
        };
    }, [useCase]);

    return {
        useCase,
        producto,
        pasoActual,
        errores
    };
};
