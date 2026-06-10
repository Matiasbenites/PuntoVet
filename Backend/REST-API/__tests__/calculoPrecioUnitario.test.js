// ============================================================
// PRUEBAS UNITARIAS – calcularPrecioUnitario
// Trazabilidad:
//   Diagrama de Secuencia Fig 13, paso 14: calcularPrecioUnitario
//   Sub-operación de setVenta (Contrato Tabla 27) – Pre: precio válido según tipo de venta
//   Casos de prueba: CP1-CP5
// ============================================================

const calcularPrecioUnitario = require('../utils/calculoPrecioUnitarioVenta');

describe('calcularPrecioUnitario', () => {

    // CP1 – Bolsa (tipoVenta=3) usa precioVenta
    it('CP1: retorna precioVenta cuando el tipo de venta es Bolsa (3)', async () => {
        const resultado = await calcularPrecioUnitario(3, 5000, 490);
        expect(resultado).toBe(5000);
    });

    // CP2 – Plata (tipoVenta=1) usa precioSuelto
    it('CP2: retorna precioSuelto cuando el tipo de venta es Plata (1)', async () => {
        const resultado = await calcularPrecioUnitario(1, 5000, 490);
        expect(resultado).toBe(490);
    });

    // CP3 – Kilo (tipoVenta=2) usa precioSuelto
    it('CP3: retorna precioSuelto cuando el tipo de venta es Kilo (2)', async () => {
        const resultado = await calcularPrecioUnitario(2, 5000, 490);
        expect(resultado).toBe(490);
    });

    // CP4 – precio 0 → excepción
    // Contrato Tabla 27, Excepción: "El producto no tiene precio válido"
    it('CP4: lanza error si el precio es 0 (producto sin precio configurado)', async () => {
        await expect(calcularPrecioUnitario(3, 0, 0))
            .rejects.toThrow('El producto no tiene un precio valido para el tipo de venta seleccionado');
    });

    // CP5 – precio null/NaN → excepción
    it('CP5: lanza error si el precio es null o no numérico', async () => {
        await expect(calcularPrecioUnitario(1, null, null))
            .rejects.toThrow('El producto no tiene un precio valido para el tipo de venta seleccionado');
    });

});
