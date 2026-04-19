import { useState } from "react"



export const useSeleccionarOpcionPago = () => {
    const [opcionPago, setOpcionPago] = useState(1);
    const [recargo, setRecargo] = useState(0);

    const seleccionOpcionPago = (value) => {
        const { codTipoPago, recargo } = value;
        setOpcionPago(codTipoPago);
        setRecargo(recargo);
    };


    return {
        opcionPago,
        recargo,
        seleccionOpcionPago
    }
}