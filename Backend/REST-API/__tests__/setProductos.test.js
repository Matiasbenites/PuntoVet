// ============================================================
// PRUEBAS UNITARIAS – setProductos (controller)
// Trazabilidad:
//   Plan de Prueba Tabla 30 – Caso de uso: Agregar Producto
//   Diagrama de Secuencia Fig 7: flujo setProducto
//   Contrato Tabla 21 – Post: producto creado, Pre: datos válidos
//   Casos de prueba: CP1-CP4
//
//   Nota CP3-CP4: los mensajes "Es requerido" e "Ingrese un número válido"
//   son validados en el frontend. Los CPs de backend verifican que el
//   controlador maneja correctamente el error cuando la BD rechaza los datos.
// ============================================================

jest.mock('../models', () => ({
    producto: { create: jest.fn() },
    categoria: {},
    tamanio: {}
}));
jest.mock('../models/producto', () => ({}));
jest.mock('../models/categoria', () => ({}));
jest.mock('../models/tamanio', () => ({}));
jest.mock('../models/productoEdad', () => ({ create: jest.fn() }));
jest.mock('../models/productoMascota', () => ({ create: jest.fn() }));
jest.mock('../utils/manejadorErrores', () => jest.fn());

const { setProductos } = require('../controllers/productos');
const { producto } = require('../models');
const ProductoEdad = require('../models/productoEdad');
const ProductoMascota = require('../models/productoMascota');
const manejadorErrores = require('../utils/manejadorErrores');

const mockRes = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    return res;
};

describe('setProductos', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // CP1 – Todos los campos completos y válidos
    // Contrato Tabla 21, Post: "Producto agregado correctamente"
    it('CP1: registra producto con todos los campos y retorna mensaje de éxito', async () => {
        producto.create.mockResolvedValue({ codProducto: 1 });
        ProductoEdad.create.mockResolvedValue({});
        ProductoMascota.create.mockResolvedValue({});

        const req = {
            body: {
                codCategoria: 1,
                codTamanio: 1,
                nombre: 'Purina Cat Chow',
                descripcion: 'Mejor alimento del mundo',
                peso: 21,
                mililitro: 0,
                stock: 50,
                precioCompra: 10.00,
                precioVenta: 15.00,
                precioSuelto: 1.50,
                codMascotas: [1],
                codEdades: [1]
            },
            file: { filename: 'producto_1.jpg' }
        };
        const res = mockRes();

        await setProductos(req, res);

        expect(producto.create).toHaveBeenCalledTimes(1);
        expect(ProductoEdad.create).toHaveBeenCalledWith({ codProducto: 1, codEdad: 1 });
        expect(ProductoMascota.create).toHaveBeenCalledWith({ codProducto: 1, codMascota: 1 });
        expect(res.send).toHaveBeenCalledWith({ message: 'Producto agregado correctamente.' });
    });

    // CP2 – Solo campos requeridos mínimos
    // Contrato Tabla 21, Post: "Producto agregado correctamente"
    it('CP2: registra producto con solo los campos requeridos y retorna mensaje de éxito', async () => {
        producto.create.mockResolvedValue({ codProducto: 2 });
        ProductoEdad.create.mockResolvedValue({});
        ProductoMascota.create.mockResolvedValue({});

        const req = {
            body: {
                codCategoria: 1,
                nombre: 'producto1',
                descripcion: 'descripcion producto 1',
                codMascotas: [1],
                codEdades: [1],
                peso: 0,
                stock: 0
            },
            file: { filename: 'img.jpg' }
        };
        const res = mockRes();

        await setProductos(req, res);

        expect(producto.create).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledWith({ message: 'Producto agregado correctamente.' });
    });

    // CP3 – Campos obligatorios vacíos
    // El frontend muestra "Es requerido"; el backend captura el error de la BD
    it('CP3: maneja el error cuando los campos obligatorios están vacíos', async () => {
        producto.create.mockRejectedValue(
            new Error('notNull Violation: producto.nombre cannot be null')
        );

        const req = {
            body: {
                nombre: '',
                descripcion: '',
                codCategoria: null,
                codMascotas: [],
                codEdades: [],
                peso: 0,
                stock: 0
            },
            file: null
        };
        const res = mockRes();

        await setProductos(req, res);

        expect(manejadorErrores).toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalledWith({ message: 'Producto agregado correctamente.' });
    });

    // CP4 – Stock con valor no numérico ("ds")
    // El frontend muestra "Ingrese un número válido"; el backend captura el error de la BD
    it('CP4: maneja el error cuando el stock tiene un valor no numérico', async () => {
        producto.create.mockRejectedValue(
            new Error('Invalid value: stock must be a number')
        );

        const req = {
            body: {
                codCategoria: 1,
                nombre: 'Producto B',
                descripcion: 'Descripción del Producto B',
                mililitro: 500,
                stock: 'ds',
                precioCompra: 10.00,
                precioVenta: 15.00,
                precioSuelto: 1.50,
                codMascotas: [1],
                codEdades: [1],
                peso: 1.5
            },
            file: { filename: 'producto_b.jpg' }
        };
        const res = mockRes();

        await setProductos(req, res);

        expect(manejadorErrores).toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalledWith({ message: 'Producto agregado correctamente.' });
    });

});
