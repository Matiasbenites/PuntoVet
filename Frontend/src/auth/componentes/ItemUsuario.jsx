import { DeleteForever, ModeEdit } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const ItemUsuario = ({ usuario, bajaUsuario }) => {
    const { codUsuario, nombreApellido, celular, estado, tipoUsuario: { tipoUsuario, codTipoUsuario } } = usuario;

    const eliminarUsuario = () => {
        bajaUsuario(codUsuario);
    }

    return (
        <Grid container sx={{
            backgroundColor: '#D9D9D9',
            marginTop: '.5rem',
            borderRadius: '1.5rem',
            padding: '.5rem 1rem',
            fontWeight: 'bold'
        }}>
            <Grid item container justifyContent={'center'} alignItems={'center'}>
                <Grid item sm={4}>
                    <Grid sx={{ display: 'flex', gap: '.5rem' }}>
                        <Typography>Nombre y Apellido: </Typography>
                        <Typography variant="span" color={"#008512"}>{nombreApellido}</Typography>
                    </Grid>
                    <Grid sx={{ display: 'flex', gap: '.5rem' }}>
                        <Typography>Cargo: </Typography>
                        <Typography variant="span" color={"#008512"}>{tipoUsuario}</Typography>
                    </Grid>
                </Grid>

                <Grid item sm={3} sx={{ display: 'flex', gap: '.5rem' }}>
                    <Typography>Celular: </Typography>
                    <Typography variant="span" color={"#008512"}>{celular}</Typography>
                </Grid>

                <Grid item sm={3} sx={{ display: 'flex', gap: '.5rem' }}>
                    <Typography>Estado: </Typography>
                    <Typography variant="span" color={"#008512"}>{estado ? 'Activo' : 'Inactivo'}</Typography>
                </Grid>

                <Grid item sm={2} sx={{ display: 'flex', gap: '.5rem' }}>
                    <Link
                        to={'/usuarios/nuevo'} state={{ codUsuario }}
                    >
                        <Button><ModeEdit color="" /></Button>
                    </Link>
                    <Button onClick={eliminarUsuario}><DeleteForever sx={{ color: estado ? 'red' : 'green' }} /></Button>
                </Grid>
            </Grid>
        </Grid >
    );
}