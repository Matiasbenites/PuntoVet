// ============================================================
// PRUEBAS UNITARIAS – updateProducto (controller)
// Trazabilidad:
//   Plan de Prueba Tabla 31 – Caso de uso: Modificar Producto
//   Diagrama de Secuencia Fig 9: flujo updateProducto (Curso Normal)
//   Contrato Tabla 23 – Post: producto actualizado correctamente
//   Casos de prueba: CP1-CP3
//
//   Nota CP2-CP3: "Es requerido" e "Ingrese un número válido" son
//   mensajes del frontend. El backend verifica que maneja el error
//   cuando la BD rechaza los datos.
// ============================================================

jest.mock('../models', () => ({
    producto: { update: jest.fn() },
    categoria: {},
    tamanio: {}
}));
jest.mock('../models/producto', () => ({}));
jest.mock('../models/categoria', () => ({}));
jest.mock('../models/tamanio', () => ({}));
jest.mock('../models/productoEdad', () => ({ create: jest.fn(), destroy: jest.fn() }));
jest.mock('../models/productoMascota', () => ({ create: jest.fn(), destroy: jest.fn() }));
jest.mock('../utils/manejadorErrores', () => jest.fn());

const { updateProducto } = require('../controllers/productos');
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

describe('updateProducto', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // CP1 – Datos correctos → "Datos modificado correctamente"
    // Contrato Tabla 23, Post: atributos actualizados, mensaje de confirmación
    it('CP1: actualiza producto con datos correctos y retorna mensaje de éxito', async () => {
        producto.update.mockResolvedValue([1]);
        ProductoEdad.destroy.mockResolvedValue(1);
        ProductoMascota.destroy.mockResolvedValue(1);
        ProductoEdad.create.mockResolvedValue({});
        ProductoMascota.create.mockResolvedValue({});

        const req = {
            params: { id: 1 },
            body: {
                codProducto: 1,
                codCategoria: 1,
                codTamanio: 1,
                nombre: 'Purina Cat Chow',
                descripcion: 'El mejor alimento del mercado',
                peso: 21,
                mililitro: 0,
                cantidad: 0,
                stock: 50,
                precioCompra: 10.00,
                precioVenta: 15.00,
                precioSuelto: 1.50,
                codMascotas: [1],
                codEdades: [1]
            }
        };
        const res = mockRes();

        await updateProducto(req, res);

        expect(producto.update).toHaveBeenCalledTimes(1);
        expect(ProductoEdad.destroy).toHaveBeenCalledWith({ where: { codProducto: 1 } });
        expect(ProductoMascota.destroy).toHaveBeenCalledWith({ where: { codProducto: 1 } });
        expect(res.send).toHaveBeenCalledWith({ message: 'Datos modificado correctamente' });
    });

    // CP2 – Campos obligatorios vacíos → error manejado por el backend
    // El frontend muestra "Es requerido"; la BD rechaza la operación
    it('CP2: maneja el error cuando los campos obligatorios están vacíos', async () => {
        ProductoEdad.destroy.mockResolvedValue(1);
        ProductoMascota.destroy.mockResolvedValue(1);
        producto.update.mockRejectedValue(new Error('notNull Violation: producto.nombre cannot be null'));

        const req = {
            params: { id: 1 },
            body: {
                codProducto: 1,
                nombre: '',
                descripcion: '',
                codCategoria: 1,
                codMascotas: [],
                codEdades: [],
                peso: 0,
                stock: 0
            }
        };
        const res = mockRes();

        await updateProducto(req, res);

        expect(manejadorErrores).toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalledWith({ message: 'Datos modificado correctamente' });
    });

    // CP3 – Datos incorrectos (cantidad negativa) → error manejado por el backend
    // El frontend muestra "Ingrese un número válido"; la BD rechaza la operación
    it('CP3: maneja el error cuando los datos ingresados son incorrectos', async () => {
        ProductoEdad.destroy.mockResolvedValue(1);
        ProductoMascota.destroy.mockResolvedValue(1);
        producto.update.mockRejectedValue(new Error('Validation error: cantidad must be non-negative'));

        const req = {
            params: { id: 1 },
            body: {
                codProducto: 1,
                codCategoria: 1,
                nombre: 'Purina Cat Chow',
                cantidad: -10,
                codMascotas: [],
                codEdades: [],
                peso: 0,
                stock: 0
            }
        };
        const res = mockRes();

        await updateProducto(req, res);

        expect(manejadorErrores).toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalledWith({ message: 'Datos modificado correctamente' });
    });

});
