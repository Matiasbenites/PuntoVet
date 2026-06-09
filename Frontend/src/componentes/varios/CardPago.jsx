import { Box, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"



export const CardPago = ({ montoToal, montoFinal, montoRecargo }) => {
    const [vuelto, setVuelto] = useState(0);
    const [pagoCliente, setPagoCliente] = useState('');

    const handleChangePago = (event) => {
        const value = event.target.value;
        if (/^\d*\.?\d*$/.test(value)) { // Aseguramos que solo se ingresen números
            setPagoCliente(value);
        }
    }

    useEffect(() => {
        const pago = parseFloat(pagoCliente);
        if (pago > montoFinal) {
            setVuelto(pago - montoFinal);
        } else {
            setVuelto(0);
        }
    }, [pagoCliente, montoFinal]);

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '1rem',
            backgroundColor: '#D9D9D9',
            boxShadow: '0px 5px 15px 3px #858585'
        }}>
            <Typography variant='h3' sx={{ color: 'black', fontWeight: 'bold', textAlign: 'right', width: '90%' }}> {montoToal} </Typography>
            <Typography variant='h3' sx={{ color: 'black', fontWeight: 'bold', textAlign: 'right', width: '90%' }}> {montoRecargo} </Typography>
            <span style={{ display: 'block', height: '1px', width: '100%', backgroundColor: 'black' }}></span>
            <Typography variant='h3' sx={{ color: 'red', fontWeight: 'bold' }}> $ {montoFinal} </Typography>
            <span style={{ display: 'block', height: '1px', width: '100%', backgroundColor: 'red' }}></span>

            {montoRecargo === 0 && (
                <>
                    <TextField
                        sx={{ marginTop: '1rem' }}
                        fullWidth
                        placeholder="Ingrese el monto del cliente"
                        value={pagoCliente}
                        onChange={handleChangePago}
                    />
                    <Typography variant='h3' sx={{ color: 'green', fontWeight: 'bold' }}> $ {vuelto.toFixed(2)} </Typography>
                </>
            )}
        </Box>
    );
}