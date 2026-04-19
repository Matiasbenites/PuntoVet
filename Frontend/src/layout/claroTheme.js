import { createTheme } from "@mui/material";

export const claroTheme = createTheme ({
    palette: {
        background: {
            default: '#F5F5F0',
            paper: '#FFFFFF'
        },
        primary: {
            main: '#1A3A3A',
            light: '#2D8C6E',
            dark: '#152B2B',
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: '#E8A83B',
            dark: '#C48B2D',
            contrastText: '#1A3A3A'
        },
        success: {
            main: '#2D8C6E',
            light: '#7DD48B',
            contrastText: '#FFFFFF'
        },
        info: {
            main: '#5B7FD4',
            contrastText: '#FFFFFF'
        },
        warning: {
            main: '#F3BA4A',
            contrastText: '#1A3A3A'
        },
        error: {
            main: '#F94646',
            contrastText: '#FFFFFF'
        },
        text: {
            primary: '#1A3A3A',
            secondary: '#556C6F'
        }
    },
    typography: {
        fontFamily: '"Rajdhani", sans-serif',
        htmlFontSize: 10,
        fontSize: 16,
    },
    root: {
        fondoClaro: '#F5F5F0',
        fondoBlanco: '#FFFFFF',
        fondoSuave: '#E1F5EE',
        azulVerdoso: '#2D8C6E',
        verdePastel: '#7DD48B',
        verdeOscuro: '#1A3A3A',
        ambar: '#E8A83B',
        azulBrillante: '#5B7FD4',
        grisPizarra: '#556C6F',
        grisClaro: '#D9D9D9',
        carmesi: '#F94646',
        blanco: '#FFFFFF',
        negro: '#1A3A3A'
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '1.5rem',
                    textTransform: 'none',
                    boxShadow: 'none'
                }
            }
        }
    }
});







 