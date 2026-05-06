import { Box, Button, Grid, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { validacion } from "../../../componentes/validaciones";
import { Producto } from "../../../modelos/Producto";

export const DatosPrincipal = ({ nuevoProducto, setNuevoProducto, progreso, setProgreso }) => {
    // Primer paso del formulario para crear/editar un producto.
    // Aquí se ingresa el nombre y descripción del producto.
    // Al enviar, se guarda en el estado y se avanza al siguiente paso.


    const { handleSubmit, register, formState: { errors }, reset } = useForm({ defaultValues: nuevoProducto });
    const navigate = useNavigate();

    const onSubmit = ({ nombre, descripcion }) => {
        const productoActualizado = Producto.from(nuevoProducto);
        productoActualizado.setProducto({ nombre, descripcion });
        setNuevoProducto(productoActualizado.obtenerEntidad());
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