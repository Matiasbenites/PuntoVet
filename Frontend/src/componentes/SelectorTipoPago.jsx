import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { getTiposPagos } from "../api/tipoPago";

export const SelectorTipoPago = ({ onSelect, estilo }) => {
    const [selectedValue, setSelectedValue] = useState('');
    const [options, setOptions] = useState([]);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const obtenerTipoPago = async () => {
            try {
                const response = await getTiposPagos();
                const data = Array.isArray(response?.data) ? response.data : [];
                setOptions(data)
                setMensaje(data.length === 0 ? 'Sin metodos de pago' : '');

                if (data.length > 0) {
                    setSelectedValue(data[0].codTipoPago);
                    onSelect(data[0]);
                }
            } catch (error) {
                console.error('Error al obtener tipos de pago:', error);
                setOptions([]);
                setMensaje('Sin metodos de pago');
            }
        }
        obtenerTipoPago();
    }, [])

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value);
        const opcionSeleccionado = options.find(option => Number(option.codTipoPago) === Number(value));
        if (opcionSeleccionado) {
            onSelect(opcionSeleccionado);
        }
    }

    return (
        <Box sx={estilo}>
            <FormControl fullWidth>
                <InputLabel id='SelectComponent'> Seleccione </InputLabel>
                <Select
                    labelId='SelectComponent'
                    id="demo-simple-select"
                    value={selectedValue}
                    label='Seleccione'
                    onChange={handleChange}
                >

                    {
                        options.length > 0 && options.map((option, index) => {
                            return (
                                <MenuItem key={option.codTipoPago} value={option.codTipoPago}>{option.nombreTipoPago}</MenuItem>
                            );
                        })
                    }
                    {
                        options.length === 0 && (
                            <MenuItem value="" disabled>{mensaje || 'Sin metodos de pago'}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        </Box>
    );
}
