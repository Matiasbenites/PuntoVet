import { Grid } from "@mui/material";


export const ContenedorLayout = ( { children } ) => {
    return (
        <Grid container sx={{ height: '100vh', placeItems: 'center', }} className="contenedor" >
            { children }
        </Grid>
    );
};