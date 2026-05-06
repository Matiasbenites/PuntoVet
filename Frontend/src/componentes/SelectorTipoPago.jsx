import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { getTiposPagos } from "../api/tipoPago";

export const SelectorTipoPago = ({ onSelect, estilo }) => {
    const [selectedValue, setSelectedValue] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const obtenerTipoPago = async () => {
            const { data } = await getTiposPagos();
            setOptions(data)

            if (data.length > 0) {
                setSelectedValue(data[0].codTipoPago);
                onSelect(data[0]);
            }
        }
        obtenerTipoPago();
    }, [])

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value);
        const opcionSeleccionado = options.find(option => option.codTipoPago === value);
        onSelect(opcionSeleccionado);
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
                </Select>
            </FormControl>
        </Box>
    );
}