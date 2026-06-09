import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";



/* 
    Necesitamos de parametros:
        * options: array de objetos con los valores value y text
        * onSelect: funcion que se ejecutara cuando se seleccione un valor
        * estilo: objeto con las propiedades de estilo
*/
export const CustomSelect = ({ options, onSelect, estilo }) => {

    const [selectedValue, setSelectedValue] = useState(1);

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value);
        onSelect(value);
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
                        options && options.map((option, index) => {
                            return (
                                <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
                            );
                        })
                    }
                </Select>
            </FormControl>
        </Box>
    );
}