import { Box, Button, Grid, TextField, FormHelperText } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { validacion } from "../../../componentes/validaciones";

export const DatosPrincipal = ({ useCase, nuevoProducto, setNuevoProducto, progreso, setProgreso }) => {
    const navigate = useNavigate();
    const [errores, setErrores] = useState([]);
    const { handleSubmit, register, formState: { errors: erroresForm }, reset } = useForm({ 
        defaultValues: nuevoProducto 
    });

    useEffect(() => {
        reset(nuevoProducto);
    }, [nuevoProducto, reset]);

    const onSubmit = async ({ nombre, descripcion }) => {
        try {
            await useCase.avanzarPaso({ nombre, descripcion });
            setNuevoProducto(useCase.obtenerProducto());
            setProgreso(useCase.getPasoActual());
            navigate('1');
        } catch (error) {
            setErrores([error.message]);
        }
    };

    const cancelarNuevoProducto = () => {
        useCase.reiniciar();
        setNuevoProducto(useCase.obtenerProducto());
        setProgreso(useCase.getPasoActual());
        navigate('../');
    };

    return (
        <Box component={'section'} sx={{ padding: '2rem' }}>
            <Grid container gap={2}>
                <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                    <TextField
                        {...register('nombre', validacion.nombre)}
                        label='Nombre' 
                        fullWidth 
                        sx={{ marginBottom: '1.5rem' }}
                        error={!!erroresForm.nombre} 
                        helperText={erroresForm.nombre?.message}
                    />

                    <TextField
                        {...register('descripcion', validacion.descripcion)}
                        fullWidth
                        multiline
                        rows={10}
                        label='Descripcion'
                        error={!!erroresForm.descripcion}
                        helperText={erroresForm.descripcion?.message}
                    />

                    {/* Mostrar errores de validación del useCase */}
                    {errores.length > 0 && (
                        <FormHelperText error sx={{ marginTop: '1rem', display: 'block' }}>
                            {errores.join(', ')}
                        </FormHelperText>
                    )}

                    <Box component={'div'} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <Button onClick={cancelarNuevoProducto} variant="contained"> 
                            Cancelar 
                        </Button>
                        <Button type="submit" variant="contained"> 
                            Siguiente 
                        </Button>
                    </Box>
                </form>
            </Grid>
        </Box>
    );
};