import { Producto } from "../modelos/Producto";

/**
 * CU: Agregar Producto / Modificar Producto | Tabla 30 / Tabla 31 | Diagrama de Clases Fig 17
 * UseCase independiente del framework para crear o editar un producto.
 * Implementa el patrón Observer (Subject): los componentes React se suscriben a eventos
 * ('productoActualizado', 'pasoAvanzado', etc.) y reaccionan sin acoplamiento directo.
 * Maneja el flujo multi-paso: datosPrincipales → categoria → mascota → precio → confirmacion.
 */
export class CrearProductoUseCase {
    constructor(productosService, catalogosService, validadorService) {
        this.productosService = productosService;
        this.catalogosService = catalogosService;
        this.validadorService = validadorService;
        
        this.producto = new Producto();
        this.pasoActual = 0;
        this.pasos = [
            'datosPrincipales',
            'categoria',
            'mascota',
            'precio',
            'confirmacion'
        ];
        
        this.listeners = new Map(); // Para notificaciones de cambios
    }

    /**
     * Obtiene el paso actual del flujo
     */
    getPasoActual() {
        return this.pasoActual;
    }

    /**
     * Obtiene el nombre del paso actual
     */
    getNombrePasoActual() {
        return this.pasos[this.pasoActual];
    }

    /**
     * CU: Agregar Producto | Tabla 30 — valida el paso actual y avanza al siguiente.
     * Dispara 'pasoAvanzado' y 'productoActualizado' para que la UI reaccione.
     * Lanza Error con los mensajes de validación si el paso no es válido.
     */
    async avanzarPaso(datosValidar = {}) {
        const validacion = await this.validarPasoActual(datosValidar);
        
        if (!validacion.valido) {
            throw new Error(validacion.errores.join(', '));
        }

        this.actualizarProducto(datosValidar);
        
        if (this.pasoActual < this.pasos.length - 1) {
            this.pasoActual++;
            this.notificar('pasoAvanzado', this.pasoActual);
        }

        return this.pasoActual;
    }

    /**
     * Retrocede al paso anterior
     */
    retrocederPaso() {
        if (this.pasoActual > 0) {
            this.pasoActual--;
            this.notificar('pasoRetrocedido', this.pasoActual);
        }
        return this.pasoActual;
    }

    /**
     * Valida el paso actual según su tipo
     */
    async validarPasoActual(datos) {
        const paso = this.pasos[this.pasoActual];

        switch (paso) {
            case 'datosPrincipales':
                return this.validadorService.validarDatosPrincipales(datos);
            case 'categoria':
                return this.validadorService.validarCategoria(datos);
            case 'mascota':
                return this.validadorService.validarMascota(datos);
            case 'precio':
                return this.validadorService.validarPrecio(datos);
            default:
                return { valido: true, errores: [] };
        }
    }

    /**
     * Actualiza el producto con los datos del paso actual
     */
    actualizarProducto(datos) {
        this.producto.setProducto(datos);
        this.notificar('productoActualizado', this.producto.obtenerEntidad());
    }

    /**
     * Obtiene el producto actual
     */
    obtenerProducto() {
        return this.producto.obtenerEntidad();
    }

    /**
     * Obtiene el catálogo de categorías
     */
    async obtenerCategorias() {
        return await this.catalogosService.getCategoria();
    }

    /**
     * Obtiene el catálogo de tamaños
     */
    async obtenerTamanios() {
        return await this.catalogosService.getTamanio();
    }

    /**
     * Obtiene el catálogo de mascotas
     */
    async obtenerMascotas() {
        return await this.catalogosService.getMascotas();
    }

    /**
     * Obtiene el catálogo de edades
     */
    async obtenerEdades() {
        return await this.catalogosService.getEdades();
    }

    /**
     * Obtiene todas las opciones necesarias para el formulario de producto
     */
    async obtenerOpcionesFormularioProducto() {
        return await this.catalogosService.obtenerOpcionesFormularioProducto();
    }

    /**
     * CU: Agregar Producto | Tabla 30 — paso final: valida completitud y persiste en el backend.
     * Pre: los 4 pasos del formulario completados. Post: producto creado en BD.
     */
    async guardar() {
        const validacion = await this.validarProductoCompleto();
        
        if (!validacion.valido) {
            throw new Error('Producto incompleto: ' + validacion.errores.join(', '));
        }

        const resultado = await this.productosService.guardar(this.producto);
        this.notificar('productoGuardado', resultado);
        return resultado;
    }

    /**
     * Valida que el producto tenga todos los campos necesarios
     */
    async validarProductoCompleto() {
        const datos = this.producto.obtenerEntidad();
        const errores = [];

        if (!datos.nombre) errores.push('Nombre requerido');
        if (!datos.descripcion) errores.push('Descripción requerida');
        if (!datos.codCategoria) errores.push('Categoría requerida');
        if (!datos.codTamanio) errores.push('Tamaño requerido');
        if (!datos.codMascotas || datos.codMascotas.length === 0) errores.push('Mascotas requeridas');
        if (!datos.codEdades || datos.codEdades.length === 0) errores.push('Edades requeridas');
        if (!datos.stock) errores.push('Stock requerido');
        if (!datos.precioCompra) errores.push('Precio de compra requerido');
        if (!datos.precioVenta) errores.push('Precio de venta requerido');

        return {
            valido: errores.length === 0,
            errores
        };
    }

    /**
     * Carga un producto existente en el useCase.
     */
    cargarProducto(datos) {
        this.producto = Producto.from(datos);
        this.notificar('productoActualizado', this.producto.obtenerEntidad());
    }

    /**
     * Reinicia el flujo de creación
     */
    reiniciar() {
        this.producto = new Producto();
        this.pasoActual = 0;
        this.notificar('flujoReiniciado', null);
    }

    /**
     * Suscribe a eventos del useCase (patrón Observer)
     */
    suscribir(evento, callback) {
        if (!this.listeners.has(evento)) {
            this.listeners.set(evento, []);
        }
        this.listeners.get(evento).push(callback);
    }

    /**
     * Notifica a los suscriptores de un evento
     */
    notificar(evento, datos) {
        if (this.listeners.has(evento)) {
            this.listeners.get(evento).forEach(callback => callback(datos));
        }
    }

    /**
     * Establece el paso actual directamente (para sincronizar con la ruta en navegación back/forward)
     */
    setPasoActual(n) {
        if (n >= 0 && n < this.pasos.length) {
            this.pasoActual = n;
        }
    }

    /**
     * Desuscribe de eventos
     */
    desuscribir(evento, callback) {
        if (this.listeners.has(evento)) {
            const callbacks = this.listeners.get(evento);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
}
