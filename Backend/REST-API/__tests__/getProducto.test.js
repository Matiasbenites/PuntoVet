// ============================================================
// PRUEBAS UNITARIAS – getProducto
// Trazabilidad:
//   Diagrama de Secuencia Fig 13, paso 9: getProducto(codProducto)
//   Diagrama de Clases Fig 20: operación getProducto en clase Producto
//   Sub-operación invocada por setVenta (Contrato Tabla 27) y setCompra
//   CP1-CP2: helper interno; sin tabla de plan de pruebas propia
// ============================================================

// Mock del modelo para no requerir conexión a BD
jest.mock('../models', () => ({
    producto: {
        findByPk: jest.fn()
    }
}));

const getProducto = require('../utils/getProducto');
const { producto } = require('../models');

describe('getProducto', () => {

    beforeEach(() => {
        producto.findByPk.mockClear();
    });

    // CP1 – Producto existente: retorna dataValues del producto encontrado
    // Paso 9 Fig 13: getProducto devuelve los datos para continuar el flujo de venta
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

        const resultado = await getProducto(1);

        expect(producto.findByPk).toHaveBeenCalledWith(1);
        expect(resultado).toEqual(mockProducto.dataValues);
    });

    // CP2 – Producto inexistente: lanza error con el código buscado
    // Excepción dentro de setVenta (Contrato Tabla 27): corta el flujo antes de modificar stock
    it('CP2: lanza error cuando el producto no existe en la base de datos', async () => {
        producto.findByPk.mockResolvedValue(null);

        await expect(getProducto(99))
            .rejects.toThrow('Producto 99 no encontrado');
    });

});
