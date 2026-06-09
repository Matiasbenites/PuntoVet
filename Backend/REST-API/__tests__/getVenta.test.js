// ============================================================
// PRUEBAS UNITARIAS – getVentas / getVenta (controller)
// Trazabilidad:
//   Plan de Prueba Tabla 34 – Caso de uso: Visualizar Venta
//   Diagrama de Secuencia Fig 13: flujo getVenta/getVentas
//   Contrato Tabla 28 – Pre: usuario autenticado
//                      Post: listado de ventas / detalle retornado
//   Casos de prueba: CP1-CP4
// ============================================================

jest.mock('../config/database', () => ({
    sequelize: { transaction: jest.fn() }
}));
jest.mock('../models', () => ({
    venta: { findAll: jest.fn(), create: jest.fn() },
    ventaDetalle: { create: jest.fn() }
}));
jest.mock('../models/venta', () => ({
    VentaDetallada: jest.fn()
}));
jest.mock('../utils/actualizarStockVenta', () => jest.fn());
jest.mock('../utils/calculoPrecioUnitarioVenta', () => jest.fn());
jest.mock('../utils/obtenerProducto', () => jest.fn());
jest.mock('../utils/calcularRecargo', () => jest.fn());

const { getVentas, getVenta } = require('../controllers/venta');
const { venta } = require('../models');
const Venta = require('../models/venta');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('getVentas', () => {

    // CP1 – Visualizar listado de ventas sin filtro de fecha
    // Tabla 34 CP1: el sistema retorna el listado completo de ventas registradas
    it('CP1: retorna el listado de ventas correctamente', async () => {
        const ventasMock = [
            { codVenta: 2, montoTotal: 8910, fecha: '2025-10-18' },
            { codVenta: 1, montoTotal: 2400, fecha: '2025-10-15' }
        ];
        venta.findAll.mockResolvedValue(ventasMock);

        const req = { query: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getVentas(req, res);

        expect(venta.findAll).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(ventasMock);
    });

});

describe('getVenta', () => {

    // CP2 – Visualizar detalle de una venta existente
    // Tabla 34 CP2: se selecciona una venta y el sistema muestra el detalle completo
    it('CP2: retorna el detalle de la venta cuando el codVenta existe', async () => {
        const detalleMock = {
            codVenta: 1,
            montoTotal: 2400,
            fecha: '2025-10-15',
            tipoPago: 'Contado',
            detalleVenta: [
                { codProducto: 1, nombre: 'Purina Cat Chow', cantidad: 10, precioUnitario: 490, subTotal: 4900 }
            ]
        };
        Venta.VentaDetallada.mockResolvedValue(detalleMock);

        const req = { params: { codVenta: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getVenta(req, res);

        expect(Venta.VentaDetallada).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(detalleMock);
    });

    // CP3 – Venta inexistente: el sistema informa que no fue encontrada
    // Tabla 34 CP3: codVenta no existe → "Venta no encontrada"
    // Contrato Tabla 28, Excepción: "Venta no encontrada"
    it('CP3: retorna error cuando la venta no existe en la base de datos', async () => {
        Venta.VentaDetallada.mockRejectedValue(new Error('Venta no encontrada'));

        const req = { params: { codVenta: 999 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getVenta(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: 'Venta no encontrada' })
        );
    });

    // CP4 – Error de conexión a la base de datos
    // Tabla 34 CP4: falla en la BD → el sistema maneja el error y retorna respuesta de error
    // Nota: el código retorna { error: <mensaje> } en status 400
    it('CP4: retorna error cuando ocurre un fallo en la base de datos', async () => {
        Venta.VentaDetallada.mockRejectedValue(new Error('ECONNREFUSED: connection refused'));

        const req = { params: { codVenta: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getVenta(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: expect.any(String) })
        );
    });

});
