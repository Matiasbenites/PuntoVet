// ============================================================
// PRUEBAS UNITARIAS – setVenta (controller)
// Trazabilidad:
//   Plan de Prueba Tabla 33 – Caso de uso: Realizar Venta
//   Diagrama de Secuencia Fig 12: flujo setVenta con transacción
//   Contrato Tabla 27 – Pre: items válidos, stock suficiente
//                      Post: venta registrada, stock actualizado
//   Casos de prueba: CP1, CP4
//
//   CP2 – "Debe ingresar solo números o con un punto": validación del frontend
//   CP3 – Botón deshabilitado con carrito vacío: validación del frontend
// ============================================================

jest.mock('../config/database', () => ({
    sequelize: { transaction: jest.fn() }
}));
jest.mock('../models', () => ({
    venta: { create: jest.fn() },
    ventaDetalle: { create: jest.fn() }
}));
jest.mock('../models/venta', () => ({
    VentaDetallada: jest.fn(),
    findAll: jest.fn()
}));
jest.mock('../utils/actualizarStockVenta', () => jest.fn());
jest.mock('../utils/calculoPrecioUnitarioVenta', () => jest.fn());
jest.mock('../utils/obtenerProducto', () => jest.fn());
jest.mock('../utils/calcularRecargo', () => jest.fn());

const { setVenta } = require('../controllers/venta');
const { sequelize } = require('../config/database');
const { venta, ventaDetalle } = require('../models');
const actualizarStock = require('../utils/actualizarStockVenta');
const calcularPrecioUnitario = require('../utils/calculoPrecioUnitarioVenta');
const obtenerProducto = require('../utils/obtenerProducto');
const obtenerRecargo = require('../utils/calcularRecargo');

let mockTransaction;

beforeEach(() => {
    jest.clearAllMocks();
    mockTransaction = {
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue()
    };
    sequelize.transaction.mockResolvedValue(mockTransaction);
});

describe('setVenta', () => {

    // CP1 – Venta con múltiples productos y tipo de pago válido
    // Tabla 33 CP1: Purina Cat Chow 10kg + Dog Selection 3 bolsas, tipoPago: Tarjeta
    // Contrato Tabla 27, Post: venta persistida, stock decrementado, mensaje de éxito
    it('CP1: registra venta con múltiples productos y retorna "Venta realizada con éxito"', async () => {
        obtenerRecargo.mockResolvedValue(1.1); // tarjeta, 10% recargo

        obtenerProducto
            .mockResolvedValueOnce({
                codProducto: 1,
                stock: 30,
                pesoTotal: 630,
                peso: 21,
                precioSuelto: 490,
                precioVenta: 2400
            })
            .mockResolvedValueOnce({
                codProducto: 2,
                stock: 15,
                pesoTotal: 375,
                peso: 25,
                precioSuelto: 800,
                precioVenta: 4500
            });

        calcularPrecioUnitario
            .mockResolvedValueOnce(490)   // Purina Cat Chow, tipoVenta=1 (kg suelto)
            .mockResolvedValueOnce(4500); // Dog Selection, tipoVenta=3 (bolsa cerrada)

        actualizarStock.mockResolvedValue();

        venta.create.mockResolvedValue({ codVenta: 1 });
        ventaDetalle.create.mockResolvedValue({});

        const req = {
            body: {
                opcionPago: 2,
                codUsuario: 1,
                detalleVenta: [
                    { codProducto: 1, cantidad: 10, tipoVenta: 1 },
                    { codProducto: 2, cantidad: 3,  tipoVenta: 3 }
                ]
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await setVenta(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Venta realizada con éxito' })
        );
        expect(mockTransaction.commit).toHaveBeenCalled();
        expect(actualizarStock).toHaveBeenCalledTimes(2);
        expect(ventaDetalle.create).toHaveBeenCalledTimes(2);
    });

    // CP4 – Cantidad solicitada supera el stock disponible
    // Tabla 33 CP4: cantidad 1000 para un producto con stock 30 → "Stock Insuficiente"
    // Contrato Tabla 27, Excepción: stock insuficiente → rollback + mensaje de error
    it('CP4: retorna error y hace rollback cuando el stock es insuficiente', async () => {
        obtenerRecargo.mockResolvedValue(1.0);

        obtenerProducto.mockResolvedValue({
            codProducto: 1,
            stock: 30,
            pesoTotal: 630,
            peso: 21,
            precioSuelto: 490,
            precioVenta: 2400
        });

        calcularPrecioUnitario.mockResolvedValue(490);

        actualizarStock.mockRejectedValue(
            new Error('Stock insuficiente para completar la venta')
        );

        const req = {
            body: {
                opcionPago: 1,
                codUsuario: 1,
                detalleVenta: [
                    { codProducto: 1, cantidad: 1000, tipoVenta: 1 }
                ]
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await setVenta(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Error al generar la venta' })
        );
        expect(mockTransaction.rollback).toHaveBeenCalled();
        expect(mockTransaction.commit).not.toHaveBeenCalled();
    });

});
