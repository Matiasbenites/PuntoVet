import { Box, Typography } from "@mui/material"
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const FinNuevoProducto = ({ progreso, setProgreso }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (progreso < 3) {
            setProgreso(0);
            navigate('/productos');
        }
    }, [progreso, navigate]);

    const location = useLocation();
    const mensaje = location.state?.mensaje;

    const time = setTimeout(() => {
        navigate('/productos');
    }, 5000);

    return (
        <Box component={'section'} sx={{ padding: '2rem' }}>
            {<Typography variant="h4"> {mensaje} </Typography>}
            <img src="/img/loadingGifSinFondo.gif" alt="Loading..." />
        </Box>
    )
}