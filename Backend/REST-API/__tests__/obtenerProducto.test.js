// ============================================================
// PRUEBAS UNITARIAS – obtenerProducto
// Trazabilidad:
//   Diagrama de Secuencia Fig 12, paso 9: obtenerProducto(codProducto)
//   Diagrama de Clases Fig 17: operación obtenerProducto en clase Producto
//   Contrato Tabla 27 – Pre: codProducto válido y existente
//                      Post: retorna datos del producto
//                      Excepción: "Producto no encontrado"
//   Casos de prueba: CP1-CP2
// ============================================================

// Mock del modelo para no requerir conexión a BD
jest.mock('../models', () => ({
    producto: {
        findByPk: jest.fn()
    }
}));

const obtenerProducto = require('../utils/obtenerProducto');
const { producto } = require('../models');

describe('obtenerProducto', () => {

    beforeEach(() => {
        producto.findByPk.mockClear();
    });

    // CP1 – Producto existente: retorna dataValues del producto encontrado
    // Contrato Tabla 27, Post: retorna los datos del producto
    it('CP1: retorna los datos del producto cuando el codProducto existe', async () => {
        const mockProducto = {
            dataValues: {
                codProducto: 1,
                nombre: 'Royal Canin',
                precioVenta: 5000,
                stock: 10
            }
        };
        producto.findByPk.mockResolvedValue(mockProducto);

        const resultado = await obtenerProducto(1);

        expect(producto.findByPk).toHaveBeenCalledWith(1);
        expect(resultado).toEqual(mockProducto.dataValues);
    });

    // CP2 – Producto inexistente: lanza error con el código buscado
    // Contrato Tabla 27, Excepción: "Producto no encontrado"
    it('CP2: lanza error cuando el producto no existe en la base de datos', async () => {
        producto.findByPk.mockResolvedValue(null);

        await expect(obtenerProducto(99))
            .rejects.toThrow('Producto 99 no encontrado');
    });

});
