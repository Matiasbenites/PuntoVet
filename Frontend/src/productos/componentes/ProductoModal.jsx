import { useTheme } from "@emotion/react";
import { Box, Card, CardMedia, Grid, Modal, Typography } from "@mui/material";
import { CardProducto } from "./CardProducto";

export const ProductoModal = ({ producto, open, setOpen }) => {
    // Modal que muestra los detalles completos de un producto cuando se hace clic en él.
    // Exhibe la imagen del producto en un lado y todos los detalles en el otro.
    // Se abre cuando el usuario hace clic en un producto de la lista.
    const theme = useTheme();
    const { root } = theme;

    const boxStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 1100,
        borderRadius: 5,

        p: 2,
        bgcolor: root.verdeClaro,
    };
    const handleClose = () => setOpen(false);
    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={boxStyle} >
                    <Grid container spacing={1}>
                        <Grid item sm={5} sx={{ background: root.blanco, borderRadius: '1.5rem', padding: '.5rem' }} >
                            <Card >
                                {
                                    producto && producto.imagen && producto.imagen != null ? (
                                        <CardMedia
                                            sx={{ objectFit: 'contain' }}
                                            component="img"
                                            height="500"
                                            image={producto.imagen}
                                            alt="green iguana"
                                        />
                                    ) : (
                                        < CardMedia
                                            sx={{ objectFit: 'contain' }}
                                            component="img"
                                            height="500"
                                            image={'/img/producto.jpg'}
                                            alt="green iguana"
                                        />
                                    )
                                }
                            </Card>
                        </Grid>
                        <Grid item sm={7} >
                            <Grid item sm={12}>
                                <CardProducto nuevoProducto={producto} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal >
        </>
    )
}