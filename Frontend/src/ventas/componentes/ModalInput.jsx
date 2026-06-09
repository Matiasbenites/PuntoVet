import { Box, Grid, Modal, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { ButonVerde, CustomSelect } from "../../componentes";

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
                precioUnitario: precio,
                subTotal,
                tipoVenta: opcionVenta,
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
        const valorPrecio = opcionVenta === 3 ? precioVenta : precioSuelto;
        setPrecio(valorPrecio);

        if (opcionVenta === 3 && Number(auxCantidad) > Number(stock)) {
            setErrores('Stock insuficiente');
            setAuxSubTotal(0);
            setSubTotal(0);
            return;
        }

        if (opcionVenta !== 1) {
            const total = Number(valorPrecio) * Number(auxCantidad);
            setAuxSubTotal(total);
            setSubTotal(total);
        } else {
            if (Number(valorPrecio) === 0) {
                setAuxSubTotal(0);
                setSubTotal(0);
            } else {
                const kilos = Number(auxCantidad) / Number(valorPrecio);
                setAuxSubTotal(Number(kilos.toFixed(3)));
                setSubTotal(Number(auxCantidad));
            }
        }

        if (opcionVenta !== 1 && Number(auxCantidad) > Number(pesoTotal)) {
            setErrores('Stock insuficiente por peso');
            return;
        }

        setErrores([]);
    }, [opcionVenta, auxCantidad, precioVenta, precioSuelto, stock, pesoTotal]);

    useEffect(() => {
        if (opcionVenta === 1) {
            setCantidad(auxSubTotal);
        } else {
            setCantidad(Number(auxCantidad));
        }
    }, [auxSubTotal, opcionVenta, auxCantidad]);

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
                            <Typography variant='h2' sx={{ color: 'red', fontWeight: 'bold' }}> $ {Number(precio).toFixed(2)} </Typography>
                            <Grid item sx={{ display: 'flex', gap: '2rem' }}>
                                <TextField
                                    label='Cantidad'
                                    onChange={habdleChangeCantidad}
                                    fullWidth
                                />
                                <CustomSelect options={opcionesVentaProducto} onSelect={handleOpcionVenta} estilo={estiloSelect} />
                            </Grid>
                            <Typography variant='h2' sx={{ color: 'green', fontWeight: 'bold' }}> {(opcionVenta === 1) ? `${Number(auxSubTotal).toFixed(3)} Kg` : `$ ${Number(auxSubTotal).toFixed(2)}`} </Typography>
                        </Grid>
                        <ButonVerde texto='Agregar' type="submit" >Agregar</ButonVerde>
                    </form>

                    {errores.length > 0 && <Typography variant="h7">{errores}</Typography>}
                </Box>
            </Box>
        </Modal >
    )
}