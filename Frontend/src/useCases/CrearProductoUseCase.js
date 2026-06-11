import EventEmitter from 'eventemitter3';
import { Producto } from "../modelos/Producto";

/**
 * CU: Agregar Producto / Modificar Producto | Tabla 30 / Tabla 31 | Diagrama de Clases Fig 17
 * UseCase independiente del framework para crear o editar un producto.
 *
 * Patrón Observer — implementado con la librería eventemitter3:
 *   Antes: se implementaba manualmente con un Map de listeners y métodos
 *          suscribir/notificar/desuscribir escritos a mano.
 *   Ahora: CrearProductoUseCase extiende EventEmitter (eventemitter3), que provee
 *          on/emit/off con manejo de memoria, errores y edge-cases ya resueltos
 *          por la librería. El comportamiento observable es idéntico; lo que
 *          cambia es que la mecánica del patrón la garantiza el framework, no
 *          código propio que habría que mantener y testear.
 *
 * Maneja el flujo multi-paso: datosPrincipales → categoria → mascota → precio → confirmacion.
 */
export class CrearProductoUseCase extends EventEmitter {
    constructor(productosService, catalogosService, validadorService) {
        // Inicializa EventEmitter (eventemitter3) — reemplaza el this.listeners = new Map()
        // que se usaba antes para registrar y despachar callbacks manualmente.
        super();

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
            // emit() de eventemitter3 reemplaza el método notificar() manual.
            // Antes: this.notificar('pasoAvanzado', this.pasoActual)
            this.emit('pasoAvanzado', this.pasoActual);
        }

        return this.pasoActual;
    }

    /**
     * Retrocede al paso anterior
     */
    retrocederPaso() {
        if (this.pasoActual > 0) {
            this.pasoActual--;
            this.emit('pasoRetrocedido', this.pasoActual);
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
        this.emit('productoActualizado', this.producto.obtenerEntidad());
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
        this.emit('productoGuardado', resultado);
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
        this.emit('productoActualizado', this.producto.obtenerEntidad());
    }

    /**
     * Reinicia el flujo de creación
     */
    reiniciar() {
        this.producto = new Producto();
        this.pasoActual = 0;
        this.emit('flujoReiniciado', null);
    }

    /**
     * Establece el paso actual directamente (para sincronizar con la ruta en navegación back/forward)
     */
    setPasoActual(n) {
        if (n >= 0 && n < this.pasos.length) {
            this.pasoActual = n;
        }
    }
}
