// ============================================================
// PRUEBAS UNITARIAS – deleteProducto (controller)
// Trazabilidad:
//   Plan de Prueba Tabla 32 – Caso de uso: Eliminar Producto
//   Diagrama de Secuencia Fig 11: flujo deleteProducto (baja lógica)
//   Contrato Tabla 25 – Post: estado del producto actualizado
//   Casos de prueba: CP1-CP2
// ============================================================

jest.mock('../models', () => ({
    producto: { findByPk: jest.fn(), update: jest.fn() },
    categoria: {},
    tamanio: {}
}));
jest.mock('../models/producto', () => ({}));
jest.mock('../models/categoria', () => ({}));
jest.mock('../models/tamanio', () => ({}));
jest.mock('../models/productoEdad', () => ({ create: jest.fn(), destroy: jest.fn() }));
jest.mock('../models/productoMascota', () => ({ create: jest.fn(), destroy: jest.fn() }));
jest.mock('../utils/manejadorErrores', () => jest.fn());

const { deleteProducto } = require('../controllers/productos');
const { producto } = require('../models');
const manejadorErrores = require('../utils/manejadorErrores');

const mockRes = () => {
    const res = {};
    res.send = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    return res;
};

describe('deleteProducto', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // CP1 – Eliminar producto activo (estado true → false)
    // Contrato Tabla 25, Post: producto marcado como eliminado
    // Resultado esperado: "Producto eliminado correctamente"
    it('CP1: cambia estado a false y retorna "Producto eliminado correctamente"', async () => {
        producto.findByPk.mockResolvedValue({
            estado: true,
            codProducto: 1,
            nombre: 'Purina Cat Chow',
            precioVenta: 2400,
            stock: 50
        });
        producto.update.mockResolvedValue([1]);

        const req = { params: { id: 1 } };
        const res = mockRes();

        await deleteProducto(req, res);

        expect(producto.findByPk).toHaveBeenCalledWith(1);
        expect(producto.update).toHaveBeenCalledWith(
            { estado: false },
            { where: { codProducto: 1 } }
        );
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Producto eliminado correctamente' })
        );
    });

    // CP2 – Restaurar producto inactivo (estado false → true)
    // Contrato Tabla 25 (restauración), Post: producto reactivado
    // Resultado esperado: "Producto restaurado correctamente"
    it('CP2: cambia estado a true y retorna "Producto restaurado correctamente"', async () => {
        producto.findByPk.mockResolvedValue({
            estado: false,
            codProducto: 2,
            nombre: 'Dog Selection',
            precioVenta: 4500,
            stock: 10
        });
        producto.update.mockResolvedValue([1]);

        const req = { params: { id: 2 } };
        const res = mockRes();

        await deleteProducto(req, res);

        expect(producto.findByPk).toHaveBeenCalledWith(2);
        expect(producto.update).toHaveBeenCalledWith(
            { estado: true },
            { where: { codProducto: 2 } }
        );
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Producto restaurado correctamente' })
        );
    });

});
