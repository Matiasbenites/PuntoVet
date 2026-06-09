// ============================================================
// PRUEBAS UNITARIAS – obtenerRecargo (calcularRecargo)
// Trazabilidad:
//   Diagrama de Secuencia Fig 12, paso 11: obtenerRecargo(tipoPago)
//   Contrato Tabla 27 – Pre: tipo de pago válido y activo
//   RF#19: "cobro mediante alguno de los métodos de pago habilitados"
//   Casos de prueba: CP1-CP3
// ============================================================

// Mock del modelo para no requerir conexión a BD
jest.mock('../models', () => ({
    tipoPago: {
        findByPk: jest.fn()
    }
}));

const obtenerRecargo = require('../utils/calcularRecargo');
const { tipoPago } = require('../models');

describe('obtenerRecargo', () => {

    beforeEach(() => {
        tipoPago.findByPk.mockClear();
    });

    // CP1 – Contado (recargo 0%): multiplicador = 1
    // Caso: el precio final no cambia con métodos de pago sin recargo
    it('CP1: retorna multiplicador 1 cuando el recargo es 0% (pago contado)', async () => {
        tipoPago.findByPk.mockResolvedValue({ recargo: 0 });

        const resultado = await obtenerRecargo(1);

        expect(resultado).toBe(1);
    });

    // CP2 – Tarjeta (recargo 10%): multiplicador = 1.1
    // RF#19: el sistema aplica el recargo del tipo de pago al monto total
    it('CP2: retorna multiplicador 1.1 cuando el recargo es 10% (tarjeta de crédito)', async () => {
        tipoPago.findByPk.mockResolvedValue({ recargo: 10 });

        const resultado = await obtenerRecargo(2);

        expect(resultado).toBeCloseTo(1.1, 5);
    });

    // CP3 – Tipo de pago inexistente → excepción
    // Contrato Tabla 27, Excepción: "Tipo de pago no encontrado"
    it('CP3: lanza error cuando el tipo de pago no existe en la base de datos', async () => {
        tipoPago.findByPk.mockResolvedValue(null);

        await expect(obtenerRecargo(99))
            .rejects.toThrow('Tipo de pago no encontrado');
    });

});
