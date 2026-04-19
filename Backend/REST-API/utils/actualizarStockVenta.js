const { producto } = require("../models");

 



const actualizarStock = async (codProducto, tipoVenta, cantidad, pesoTotal, peso, stock) => {
    let newStock = 0;
    let newPesoTotal = 0;
    console.log('DATOS: CodProducto: ', codProducto, 'TipoVenta: ', tipoVenta, 'PesoTotal: ', pesoTotal, 'PESO: ', peso, 'Stock: ', stock);
    switch (tipoVenta) {
        case 3:
            newStock = stock - cantidad
            newPesoTotal = pesoTotal - (cantidad * peso)
            break;
        default:
            newPesoTotal = pesoTotal - cantidad;
            newStock = Math.floor(newPesoTotal / peso)
            break;
    }
    newData = {
        pesoTotal: newPesoTotal,
        stock: newStock
    }

    console.log('Datos Stock: ', newData, 'CANTIDAD: ', cantidad);

    await producto.update(newData, { where: { codProducto: codProducto } })

    console.log('Stock: ', newData);

}

module.exports = actualizarStock;