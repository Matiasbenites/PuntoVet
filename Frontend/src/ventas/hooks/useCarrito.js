import { useEffect, useState } from "react"

export const useCarrito = (recargo, productoSeleccionado) => {
    const [carrito, setCarrito] = useState([]);
    const [montoTotal, setMontoTotal] = useState(0);
    const [montoRecargo, setMontoRecargo] = useState(0);
    const [montoFinal, setMontoFinal] = useState(0);

    const addCarrito = (productoCarrito) => {
        console.log(productoCarrito);
        const { precioVenta } = productoSeleccionado;
        productoCarrito.precioVenta = precioVenta;
        const verificacion = carrito.find(item => item.codProducto === productoCarrito.codProducto);
        if (verificacion) {
            alert('Este producto ya se encuentra en el carrito. ')
            return
        }

        setCarrito([...carrito, productoCarrito])
    }

    const onQuitarProductoCarrito = (value) =>
        setCarrito(carrito.filter((car) => car.codProducto != value));


    useEffect(() => {
        let monto = 0;
        let montoRecargo = 0;

        for (let i = 0; i < carrito.length; i++) {
            monto += Number(carrito[i].subTotal) || 0;
        }

        montoRecargo = monto * (recargo / 100);

        const precioFinal = monto + montoRecargo;
        setMontoTotal(monto);
        setMontoRecargo(montoRecargo);
        setMontoFinal(precioFinal);

    }, [carrito, recargo]);

    return {
        carrito,
        montoTotal,
        montoRecargo,
        montoFinal,
        addCarrito,
        onQuitarProductoCarrito
    }
}