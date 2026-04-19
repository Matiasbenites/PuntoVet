import { CssBaseline } from "@mui/material";
import { claroTheme } from './claroTheme';
import { ThemeProvider } from "@emotion/react";

export const AppTheme = ( { children } ) => {
    
    return (
        <ThemeProvider theme={claroTheme}>
            <CssBaseline />
            { children }
        </ThemeProvider> 
    );
};