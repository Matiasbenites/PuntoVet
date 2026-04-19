import { useTheme } from "@emotion/react";
import { Container } from "@mui/material"




export const ContenedorFormulariosPrincipales = ({ children }) => {

    const { root } = useTheme();

    return (
        <Container className="animate__animated animate__bounceInRight" sx={{ backgroundColor: `${root.verdeClaro}`, padding: '1rem', margin: '1rem auto', borderRadius: '.5rem', minHeight: '60vh' }}>
            {children}
        </Container>
    )
}