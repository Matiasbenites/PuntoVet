import { TextField, createTheme } from "@mui/material";
import styled from "@emotion/styled";


export const claroTheme = createTheme ({
    palette: {
        background: {
            default: '#F3F4E5'
        },
        primary:{
            main: '#000000',
            blanco: '#FFF'
        },
        secondary: {
            main: '#7AACB3'
        }
    },
    typography: {
        fontFamily: '"Rajdhani", sans-serif', 
        htmlFontSize: 10,
        fontSize: 16, 
    },
    root:{
        azulVerdoso: '#7AACB3',
        grisPizarra: '#7d8181',
        
        verde: '#3BBC57',
        dorado: '#F3BA4A',
        azulReal: '#3B57BC',
        carmesi: '#F94646',
        lavanda: '#f4e5f1',
        verdeOscuro: '#008512',
        grisClaro: '#D9D9D9',
        blanco: '#FFFFFF',
        negro: '#000000',
        verdeClaro: '#bde0c5',
    }
})







 