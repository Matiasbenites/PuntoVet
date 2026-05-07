export class Producto {
    constructor(datos = {}) {
        this.codProducto = datos.codProducto ?? '';
        this.codCategoria = datos.codCategoria ?? '';
        this.codTamanio = datos.codTamanio ?? '';
        this.codMascotas = datos.codMascotas ?? [];
        this.codEdades = datos.codEdades ?? [];
        this.nombre = datos.nombre ?? '';
        this.descripcion = datos.descripcion ?? '';
        this.peso = datos.peso ?? '';
        this.mililitro = datos.mililitro ?? '';
        this.cantidad = datos.cantidad ?? '';
        this.imagen = datos.imagen ?? null;
        this.stock = datos.stock ?? '';
        this.precioCompra = datos.precioCompra ?? '';
        this.precioVenta = datos.precioVenta ?? '';
        this.precioSuelto = datos.precioSuelto ?? '';
        this.estado = datos.estado ?? 1;
    }

    setProducto({
        codCategoria,
        codTamanio,
        codMascotas,
        codEdades,
        nombre,
        descripcion,
        peso,
        mililitro,
        cantidad,
        imagen,
        stock,
        precioCompra,
        precioVenta,
        precioSuelto,
        estado
    }) {
        this.codCategoria = codCategoria ?? this.codCategoria;
        this.codTamanio = codTamanio ?? this.codTamanio;
        this.codMascotas = codMascotas ?? this.codMascotas;
        this.codEdades = codEdades ?? this.codEdades;
        this.nombre = nombre ?? this.nombre;
        this.descripcion = descripcion ?? this.descripcion;
        this.peso = peso ?? this.peso;
        this.mililitro = mililitro ?? this.mililitro;
        this.cantidad = cantidad ?? this.cantidad;
        this.imagen = imagen ?? this.imagen;
        this.stock = stock ?? this.stock;
        this.precioCompra = precioCompra ?? this.precioCompra;
        this.precioVenta = precioVenta ?? this.precioVenta;
        this.precioSuelto = precioSuelto ?? this.precioSuelto;
        this.estado = estado ?? this.estado;
        return this;
    }

    obtenerEntidad() {
        return {
            codProducto: this.codProducto,
            codCategoria: this.codCategoria,
            codTamanio: this.codTamanio,
            codMascotas: this.codMascotas,
            codEdades: this.codEdades,
            nombre: this.nombre,
            descripcion: this.descripcion,
            peso: this.peso,
            mililitro: this.mililitro,
            cantidad: this.cantidad,
            imagen: this.imagen,
            stock: this.stock,
            precioCompra: this.precioCompra,
            precioVenta: this.precioVenta,
            precioSuelto: this.precioSuelto,
            estado: this.estado
        };
    }

    static from(datos = {}) {
        return new Producto(datos);
    }
}
