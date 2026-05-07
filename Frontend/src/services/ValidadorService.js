/**
 * Servicio de validación independiente del framework.
 * Contiene toda la lógica de validación reutilizable en cualquier frontend.
 */
export class ValidadorService {
    /**
     * Valida datos principales (nombre, descripción)
     */
    validarDatosPrincipales(datos) {
        const errores = [];

        if (!datos.nombre || datos.nombre.trim().length === 0) {
            errores.push('El nombre es requerido');
        }
        if (datos.nombre && datos.nombre.length > 100) {
            errores.push('El nombre no puede exceder 100 caracteres');
        }

        if (!datos.descripcion || datos.descripcion.trim().length === 0) {
            errores.push('La descripción es requerida');
        }
        if (datos.descripcion && datos.descripcion.length > 500) {
            errores.push('La descripción no puede exceder 500 caracteres');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }

    /**
     * Valida categoría y tamaño
     */
    validarCategoria(datos) {
        const errores = [];

        if (!datos.codCategoria) {
            errores.push('La categoría es requerida');
        }
        if (!datos.codTamanio) {
            errores.push('El tamaño es requerido');
        }

        // Validar campos numéricos opcionales
        if (datos.peso && isNaN(datos.peso)) {
            errores.push('El peso debe ser un número válido');
        }
        if (datos.mililitro && isNaN(datos.mililitro)) {
            errores.push('Los mililitros deben ser un número válido');
        }
        if (datos.cantidad && isNaN(datos.cantidad)) {
            errores.push('La cantidad debe ser un número válido');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }

    /**
     * Valida mascotas y edades
     */
    validarMascota(datos) {
        const errores = [];

        if (!datos.codMascotas || datos.codMascotas.length === 0) {
            errores.push('Debe seleccionar al menos una mascota');
        }
        if (!datos.codEdades || datos.codEdades.length === 0) {
            errores.push('Debe seleccionar al menos una edad');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }

    /**
     * Valida precios
     */
    validarPrecio(datos) {
        const errores = [];

        if (!datos.stock || isNaN(datos.stock) || datos.stock <= 0) {
            errores.push('El stock debe ser un número mayor a 0');
        }
        if (!datos.precioCompra || isNaN(datos.precioCompra) || datos.precioCompra < 0) {
            errores.push('El precio de compra debe ser un número válido');
        }
        if (!datos.precioVenta || isNaN(datos.precioVenta) || datos.precioVenta < 0) {
            errores.push('El precio de venta debe ser un número válido');
        }
        if (datos.precioSuelto && (isNaN(datos.precioSuelto) || datos.precioSuelto < 0)) {
            errores.push('El precio suelto debe ser un número válido');
        }

        // Validación lógica: precio venta no puede ser menor a precio compra
        if (datos.precioCompra && datos.precioVenta && datos.precioVenta < datos.precioCompra) {
            errores.push('El precio de venta no puede ser menor al precio de compra');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }

    /**
     * Valida un email (reutilizable para usuarios, etc)
     */
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Valida un número entero positivo
     */
    validarNumeroPositivo(valor) {
        return Number.isInteger(Number(valor)) && Number(valor) > 0;
    }

    /**
     * Valida un número decimal positivo
     */
    validarNumeroDecimal(valor) {
        const num = parseFloat(valor);
        return !isNaN(num) && num >= 0;
    }

    /**
     * Valida longitud de string
     */
    validarLongitud(texto, minimo, maximo) {
        if (!texto) return minimo === 0;
        return texto.length >= minimo && texto.length <= maximo;
    }
}
