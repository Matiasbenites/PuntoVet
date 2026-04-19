import { Box, Grid, Modal, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { comprobarNumero } from "../../hook/useValidacionInput";
import { ButonVerde } from "../../componetes/Botones";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    width: '80%'
};


const initialState = {
    precioCompra: 0,
    precioVenta: 0,
    precioSuelto: 0,
    cantidad: 1,
}

export const ModalInputCompra = ({ open, handleClose, producto, onProductoCarrito }) => {
    const { codProducto, stock, nombre, peso, nombreMascotas } = producto;

    const [errores, setErrores] = useState([]);
    const [inputs, setInputs] = useState(initialState);


    const handleCantidad = (event) => {
        const { name, value } = event.target;
        if (comprobarNumero(value)) {
            setInputs((prevData) => ({ ...prevData, [name]: value }))
            setErrores('');
        } else {
            setErrores('Debe ingresar un numero');
        }
    }

    useEffect(() => {
        const calcularPreciosSugeridos = () => {
            const precioSueltoSugerido = (inputs.precioCompra * 1.40) / peso;
            const precioVentaSugerido = (inputs.precioCompra * 1.20);

            setInputs((prevData) => ({
                ...prevData,
                precioVenta: precioVentaSugerido,
                precioSuelto: precioSueltoSugerido,
            }))

        }

        inputs.precioCompra && calcularPreciosSugeridos();
    }, [inputs.precioCompra])

    const handleSubmit = (event) => {
        event.preventDefault();
        if (errores.length === 0) {
            const subTotal = (inputs.precioCompra * inputs.cantidad)
            const producto = {
                ...inputs,
                codProducto,
                nombre,
                nombreMascotas,
                subTotal
            }
            onProductoCarrito(producto);
            setInputs(initialState);
            handleClose();
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Typography variant="h4">Stock: {stock}</Typography>
                <Box>
                    <form onSubmit={handleSubmit}>
                        <Grid>
                            <TextField label={'Cantidad'} name="cantidad" onChange={handleCantidad} value={inputs.cantidad} />
                            <TextField label={'Precio Compra'} name="precioCompra" onChange={handleCantidad} value={inputs.precioCompra} />
                            <TextField label={'Precio Venta Sugerido'} name="precioVenta" onChange={handleCantidad} value={inputs.precioVenta} />
                            <TextField label={'Precio Suelto Sugerido'} name="precioSuelto" onChange={handleCantidad} value={inputs.precioSuelto} />
                        </Grid>
                        <ButonVerde type="submit">Enviar</ButonVerde>
                    </form>
                </Box>
                {errores.length > 0 && <Typography variant="caption">{errores}</Typography>}
            </Box >

        </Modal >
    )
}