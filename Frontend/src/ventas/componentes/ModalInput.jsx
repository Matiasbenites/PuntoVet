import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ButonVerde, CustomSelect } from "../../componetes";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const estiloSelect = {
    width: '100%',
}

const opcionesVentaProducto = [
    { value: 1, text: 'Plata' },
    { value: 2, text: 'Kilo' },
    { value: 3, text: 'Bolsa' },
]

export const ModalInput = ({ open, handleClose, producto, opcionPago, onProductoCarrito }) => { //definir estados iniciales
    const { codProducto, nombre, stock, precioVenta, precioSuelto, nombreMascotas, nombreEdades, pesoTotal } = producto;

    const [precio, setPrecio] = useState(0) // Lo que sale el producto
    const [opcionVenta, setOpcionVenta] = useState(1); // Opcion por kilo, bolsa o plata
    const [cantidad, setCantidad] = useState(1);    // Cantidad que lleva 
    const [subTotal, setSubTotal] = useState(0);    // Sub Total
    const [auxSubTotal, setAuxSubTotal] = useState(0); // Aux Sub Total [ sirve para calcular cuando es por plata ]
    const [auxCantidad, setAuxCantidad] = useState(0); // Aux Cantidad [ sirve para calcular cuando es por plata ]
    const [errores, setErrores] = useState([]) // Para listar los errores. 

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!cantidad) {
            setErrores('Debes agregar una cantidad')
            return;
        }
        if (errores.length === 0) {
            const producto = {
                codProducto,
                nombre,
                cantidad,
                precio,
                subTotal,
                opcionVenta,
                nombreMascotas,
                nombreEdades
            }
            console.log(producto);
            onProductoCarrito(producto);
            setOpcionVenta(1)
            setCantidad(0);
            setSubTotal(0);
            setAuxCantidad(0);
            setAuxSubTotal(0);
            handleClose();

        }
    }

    const habdleChangeCantidad = (event) => {
        const num = event.target.value;
        const regex = /^\d*\.?\d{0,2}$/;

        if (!regex.test(num)) {
            setErrores('Debe ingresar solo numeros o con un punto');
            return;
        }

        console.log('Peso total: ', pesoTotal, 'num: ', num);

        setAuxCantidad(num); // Este tiene el valor que ingresa el usuario. 

    }

    const handleOpcionVenta = (value) => setOpcionVenta(value);

    useEffect(() => {
        switch (opcionVenta) {
            case 3:
                setPrecio(precioVenta)
                break;
            default:
                setPrecio(precioSuelto)
                break;
        }

        if (opcionVenta === 3 && auxCantidad > stock) {
            setErrores('Stock insuficiente');
            return;
        }

        if (opcionVenta != 1) {
            setAuxSubTotal(precio * auxCantidad);
            setSubTotal(precio * auxCantidad);
        } else {
            setAuxSubTotal(parseFloat((auxCantidad / precio).toFixed(3)));
            setSubTotal(auxCantidad);
        }
        setErrores([])
    }, [opcionPago, opcionVenta, auxCantidad, precio, producto])

    useEffect(() => {
        if (opcionVenta === 1) {
            if (auxSubTotal > pesoTotal) {
                setErrores('Stock insuficiente por peso');
                return;
            }
            setCantidad(auxSubTotal)

        } else {
            setCantidad(auxCantidad)
        }

    }, [auxSubTotal]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant='h4'> Ingrese los datos. Stock {stock}</Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid container sx={{ gap: '2rem', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }} >
                            <Typography variant='h2' sx={{ color: 'red', fontWeight: 'bold' }}> $ {precio} </Typography>
                            <Grid item sx={{ display: 'flex', gap: '2rem' }}>
                                <TextField
                                    label='Cantidad'
                                    onChange={habdleChangeCantidad}
                                    fullWidth
                                />
                                <CustomSelect options={opcionesVentaProducto} onSelect={handleOpcionVenta} estilo={estiloSelect} />
                            </Grid>
                            <Typography variant='h2' sx={{ color: 'green', fontWeight: 'bold' }}> {(opcionVenta === 1) ? `${auxSubTotal} Kg` : `$ ${auxSubTotal}`} </Typography>
                        </Grid>
                        <ButonVerde texto='Agregar' type="submit" >Agregar</ButonVerde>
                    </form>

                    {errores.length > 0 && <Typography variant="h7">{errores}</Typography>}
                </Box>
            </Box>
        </Modal >
    )
}