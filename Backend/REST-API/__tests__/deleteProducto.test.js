// ============================================================
// PRUEBAS UNITARIAS – deleteProducto (controller)
// Trazabilidad:
//   Plan de Prueba Tabla 32 – Caso de uso: Eliminar Producto
//   Diagrama de Secuencia Fig 11: flujo deleteProducto (baja lógica)
//   Contrato Tabla 25 – Post: estado del producto actualizado
//   Casos de prueba: CP1-CP2
// ============================================================

jest.mock('../config/database', () => ({
    sequelize: { query: jest.fn() }
}));
jest.mock('../models/producto', () => ({}));
jest.mock('../utils/manejadorErrores', () => jest.fn());

const { deleteProducto } = require('../controllers/productos');
const { sequelize } = require('../config/database');
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
        sequelize.query
            .mockResolvedValueOnce([{ estado: true }])  // SELECT estado
            .mockResolvedValueOnce([]);                   // CALL ModificarEstadoProducto

        const req = { params: { id: 1 } };
        const res = mockRes();

        await deleteProducto(req, res);

        expect(sequelize.query).toHaveBeenCalledTimes(2);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Producto eliminado correctamente' })
        );
    });

    // CP2 – Restaurar producto inactivo (estado false → true)
    // Contrato Tabla 25 (restauración), Post: producto reactivado
    // Resultado esperado: "Producto restaurado correctamente"
    it('CP2: cambia estado a true y retorna "Producto restaurado correctamente"', async () => {
        sequelize.query
            .mockResolvedValueOnce([{ estado: false }])  // SELECT estado
            .mockResolvedValueOnce([]);                    // CALL ModificarEstadoProducto

        const req = { params: { id: 2 } };
        const res = mockRes();

        await deleteProducto(req, res);

        expect(sequelize.query).toHaveBeenCalledTimes(2);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Producto restaurado correctamente' })
        );
    });

});
