

// models/Producto.js
const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');
const Categoria = require('./categoria');
const Tamanio = require('./tamanio');
const ProductoEdad = require('./productoEdad');
const Edad = require('./edad');
const Mascota = require('./mascota');
const ProductoMascota = require('./productoMascota');
const { mascota } = require('.');

const Producto = sequelize.define('producto', {
    codProducto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codCategoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    codTamanio: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(300),
        allowNull: true,
        defaultValue: 'Sin descripción'
    },
    peso: {
        type: DataTypes.DOUBLE(5, 2),
        allowNull: true,
        defaultValue: 0
    },
    mililitro: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    imagen: {
        type: DataTypes.STRING(200),
        allowNull: true,
        defaultValue: 'default.jpg'
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    precioVenta: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 0
    },
    precioCompra: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 0
    },
    precioSuelto: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 0
    },
    pesoTotal: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 0
    },
},
    {
        tableName: 'producto',
        timestamps: false
    },

);

Producto.belongsTo(Categoria, { foreignKey: 'codCategoria', as: 'categoria' });
Producto.belongsTo(Tamanio, { foreignKey: 'codTamanio', as: 'tamanio' });

Producto.belongsToMany(Edad, { through: ProductoEdad, foreignKey: 'codProducto', as: 'edades' });
Edad.belongsToMany(Producto, { through: ProductoEdad, foreignKey: 'codEdad' });

Producto.belongsToMany(Mascota, { through: ProductoMascota, foreignKey: 'codProducto', as: 'mascotas' });
Mascota.belongsToMany(Producto, { through: ProductoMascota, foreignKey: 'codMascota' });

Producto.findAllData = function ({ offset, limit, estado, busqueda }) {
    let filtro = { estado }
    if (busqueda) {
        filtro = {
            ...filtro,
            [Op.or]: [
                { codProducto: { [Op.like]: '%' + busqueda + '%' } },
                { nombre: { [Op.like]: '%' + busqueda + '%' } }
            ]
        }
    }

    return Producto.findAll({
        where: filtro,
        include: [
            {
                model: Categoria,
                as: 'categoria',
                attributes: ['nombreCategoria']
            },
            {
                model: Tamanio,
                as: 'tamanio',
                attributes: ['nombreTamanio']
            },
            {
                model: Edad,
                as: 'edades',
                through: { attributes: [] },
                attributes: ['nombreEdad', 'codEdad']
            },
            {
                model: Mascota,
                as: 'mascotas',
                through: { attributes: [] },
                attributes: ['nombreMascota', 'codMascota']
            }
        ],
        offset,
        limit
    }).then(productos => {
        const productosConDatos = productos.map(producto => {
            const productoConDatos = producto.toJSON();

            productoConDatos.nombreEdades = producto.edades.map(edad => edad.nombreEdad).join(' - ');
            productoConDatos.nombreMascotas = producto.mascotas.map(mascota => mascota.nombreMascota).join(' - ');

            productoConDatos.codEdades = producto.edades.map(edad => edad.codEdad)
            productoConDatos.codMascotas = producto.mascotas.map(mascota => mascota.codMascota)

            return productoConDatos;
        });
        return productosConDatos;
    });
}

Producto.findProductData = function ({ where }) {
    return Producto.findOne({
        where,
        include: [
            {
                model: Edad,
                as: 'edades',
                through: { attributes: [] },
                attributes: ['codEdad', 'nombreEdad']
            },
            {
                model: Mascota,
                as: 'mascotas',
                through: { attributes: [] },
                attributes: ['codMascota', 'nombreMascota']
            }
        ]
    }).then(producto => {
        if (producto) {
            const productoConDatos = producto.toJSON();
            productoConDatos.codEdades = producto.edades.map(edad => edad.codEdad);
            productoConDatos.codMascotas = producto.mascotas.map(mascota => mascota.codMascota);

            productoConDatos.nombreEdades = producto.edades.map(edad => edad.nombreEdad).join(' - ');
            productoConDatos.nombreMascotas = producto.mascotas.map(mascota => mascota.nombreMascota).join(' - ');

            return productoConDatos;
        } else {
            return null;
        }
    });
};



module.exports = Producto;
