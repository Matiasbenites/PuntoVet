import { Box, Button, Grid, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { validacion } from "../../../componetes/validaciones";

export const DatosPrincipal = ({ nuevoProducto, setNuevoProducto, progreso, setProgreso }) => {


    const { handleSubmit, register, formState: { errors }, reset } = useForm({ defaultValues: nuevoProducto });
    const navigate = useNavigate();

    const onSubmit = ({ nombre, descripcion }) => {
        setNuevoProducto({ ...nuevoProducto, nombre, descripcion });
        setProgreso(progreso + 1);
        navigate('1');
    }

    const cancelarNuevoProducto = () => {
        setNuevoProducto({})
        navigate('../')
    }

    return (
        <Box component={'section'} sx={{ padding: '2rem' }}>
            <Grid container gap={2}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        {...register('nombre', validacion.nombre)}
                        label='Nombre' fullWidth sx={{ marginBottom: '1.5rem' }}
                        error={!!errors.nombre} helperText={errors.nombre?.message}
                    />

                    <TextField
                        {...register('descripcion', validacion.descripcion)}
                        fullWidth
                        multiline
                        rows={10}
                        label='Descripcion'
                        error={!!errors.descripcion}
                        helperText={errors.descripcion?.message}
                    />

                    <Box component={'div'} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <Button onClick={cancelarNuevoProducto} variant="contained"> Cancelar </Button>
                        <Button type="submit" variant="contained"> Siguiente </Button>
                    </Box>
                </form>
            </Grid>
        </Box>
    );
};