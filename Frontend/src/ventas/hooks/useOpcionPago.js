import { useState } from "react"



export const useSeleccionarOpcionPago = () => {
    const [opcionPago, setOpcionPago] = useState(1);
    const [recargo, setRecargo] = useState(0);

    const seleccionOpcionPago = (value) => {
        if (!value) return;
        const { codTipoPago, recargo } = value;
        setOpcionPago(Number(codTipoPago));
        setRecargo(Number(recargo) || 0);
    };


    return {
        opcionPago,
        recargo,
        seleccionOpcionPago
    }
}
