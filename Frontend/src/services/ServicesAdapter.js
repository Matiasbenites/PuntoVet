import * as productosApi from "../api/productos/productosApi";
import * as catalogosApi from "../api/catalogos/catalogosApi";

/**
 * Wrapper agnóstico del framework para el servicio de Productos.
 * Adapta las llamadas a la API de productos.
 */
export class ProductosServiceAdapter {
    async guardar(producto) {
        const datos = producto.obtenerEntidad();
        
        if (datos.codProducto) {
            return await productosApi.updateProducto(datos);
        } else {
            return await productosApi.setProducto(datos);
        }
    }

    async actualizar(producto) {
        return await productosApi.updateProducto(producto.obtenerEntidad());
    }

    async crear(producto) {
        return await productosApi.setProducto(producto.obtenerEntidad());
    }

    async obtener(codProducto) {
        // Esta función debería existir en productosApi
        // Por ahora solo es un ejemplo de cómo sería
        // return await productosApi.getProducto(codProducto);
    }
}

/**
 * Wrapper agnóstico del framework para el servicio de Catálogos.
 * Adapta las llamadas a la API de catálogos.
 */
export class CatalogosServiceAdapter {
    async getCategoria() {
        return await catalogosApi.getCategoria();
    }

    async getTamanio() {
        return await catalogosApi.getTamanio();
    }

    async getMascotas() {
        return await catalogosApi.getMascotas();
    }

    async getEdades() {
        return await catalogosApi.getEdades();
    }

    async obtenerOpcionesFormularioProducto() {
        const [categorias, tamanios, mascotas, edades] = await Promise.all([
            this.getCategoria(),
            this.getTamanio(),
            this.getMascotas(),
            this.getEdades()
        ]);

        return {
            categorias,
            tamanios,
            mascotas,
            edades
        };
    }
}

/**
 * Factory para crear las instancias de servicios.
 * Centraliza la inyección de dependencias.
 */
export class ServicesFactory {
    static crearProductosService() {
        return new ProductosServiceAdapter();
    }

    static crearCatalogosService() {
        return new CatalogosServiceAdapter();
    }
}
