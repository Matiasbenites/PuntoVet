// ============================================================
// PRUEBAS UNITARIAS – actualizarStock
// Trazabilidad:
//   Diagrama de Secuencia Fig 12, pasos 17-18: actualizarStock(codProducto, cantidad)
//   Diagrama de Clases Fig 17: operación actualizarStock en clase Producto
//   Contrato Tabla 27 – Pre: cantidad <= stock, Post: stock decrementado
//   Casos de prueba: CP1-CP6
// ============================================================

// Mock del modelo para no requerir conexión a BD
jest.mock('../models', () => ({
    producto: {
        update: jest.fn().mockResolvedValue([1])
    }
}));

const actualizarStock = require('../utils/actualizarStockVenta');
const { producto } = require('../models');

describe('actualizarStock', () => {

    beforeEach(() => {
        producto.update.mockClear();
    });

    // CP1 – Bolsa (tipoVenta=3) sin peso: descuenta unidades, preserva pesoTotal
    // Historia de Usuario 3: venta por unidad (bolsa) sin peso configurado
    it('CP1: tipoVenta=3 (Bolsa) descuenta stock y preserva pesoTotal cuando peso es 0', async () => {
        // stock=10, pesoTotal=50, peso=0, cantidad=2 → newStock=8, pesoTotal sin cambio
        await actualizarStock(1, 3, 2, 50, 0, 10);

        expect(producto.update).toHaveBeenCalledWith(
            { pesoTotal: 50, stock: 8 },
            expect.objectContaining({ where: { codProducto: 1 } })
        );
    });

    // CP2 – Bolsa (tipoVenta=3) con peso: descuenta stock y pesoTotal
    it('CP2: tipoVenta=3 (Bolsa) descuenta stock y actualiza pesoTotal cuando peso es válido', async () => {
        // stock=10, pesoTotal=50, peso=5, cantidad=2 → newStock=8, newPesoTotal=40
        await actualizarStock(1, 3, 2, 50, 5, 10);

        expect(producto.update).toHaveBeenCalledWith(
            { pesoTotal: 40, stock: 8 },
            expect.objectContaining({ where: { codProducto: 1 } })
        );
    });

    // CP3 – Plata/Kilo (tipoVenta=1): descuenta pesoTotal y recalcula stock
    // Diagrama Secuencia Fig 12: "actualiza stock" tras calcular kg comprados
    it('CP3: tipoVenta=1 (Plata) descuenta pesoTotal y recalcula stock desde peso unitario', async () => {
        // stock=10, pesoTotal=50, peso=5, cantidad=3kg → newPesoTotal=47, newStock=floor(47/5)=9
        await actualizarStock(1, 1, 3, 50, 5, 10);

        expect(producto.update).toHaveBeenCalledWith(
            { pesoTotal: 47, stock: 9 },
            expect.objectContaining({ where: { codProducto: 1 } })
        );
    });

    // CP4 – Stock insuficiente → excepción
    // Diagrama Secuencia Fig 13 (Curso Alternativo 1): "Stock insuficiente"
    it('CP4: lanza error cuando la cantidad supera el stock disponible', async () => {
        // stock=10, cantidad=15 → newStock=-5 → error
        await expect(actualizarStock(1, 3, 15, 50, 0, 10))
            .rejects.toThrow('Stock insuficiente para completar la venta');
    });

    // CP5 – Cantidad inválida → excepción
    // Contrato Tabla 27, Pre: "cantidad > 0"
    it('CP5: lanza error cuando la cantidad es 0 o negativa', async () => {
        await expect(actualizarStock(1, 3, 0, 50, 0, 10))
            .rejects.toThrow('La cantidad de venta debe ser mayor a cero');
    });

    // CP6 – Kilo/Plata sin peso unitario → excepción
    // Pre: producto debe tener peso > 0 para ventas por peso
    it('CP6: lanza error en venta por peso (tipo 1/2) si el producto no tiene peso unitario', async () => {
        await expect(actualizarStock(1, 1, 3, 50, 0, 10))
            .rejects.toThrow('El producto no tiene peso unitario valido');
    });

});
