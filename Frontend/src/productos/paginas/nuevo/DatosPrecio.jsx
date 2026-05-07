import { Box, Button, Grid, MenuItem, Select, TextField, FormHelperText } from "@mui/material"
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { validacion } from "../../../componentes/validaciones";

export const DatosPrecio = ({ useCase, nuevoProducto, setNuevoProducto, progreso }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (progreso < 2) {
            navigate('/productos');
        }
    }, [progreso, navigate]);

    const [estado, setEstado] = useState(nuevoProducto.estado ?? 1);
    const [errores, setErrores] = useState([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: nuevoProducto });

    useEffect(() => {
        reset(nuevoProducto);
    }, [nuevoProducto, reset]);

    const handleEstado = (event) => {
        setEstado(event.target.value)
    }

    const onSubmit = async ({ stock, precioCompra, precioVenta, precioSuelto }) => {
        try {
            await useCase.avanzarPaso({
                stock,
                precioCompra,
                precioVenta,
                precioSuelto,
                estado
            });

            setNuevoProducto(useCase.obtenerProducto());
            const mensaje = await Promise.race([
                useCase.guardar(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Tiempo de espera excedido')), 10000))
            ]);

            navigate('../4', { state: { mensaje } });
        } catch (error) {
            setErrores([error.message]);
            navigate('../4', { state: { mensaje: 'No se pudo cargar el producto: ' + error.message } });
        }
    }

    return (
        <Box component={'section'} sx={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={10}>

                    <Grid item container spacing={4}>
                        <Grid item>
                            <TextField
                                label='Stock' error={!!errors.stock}
                                {...register('stock', validacion.stock)}
                                helperText={errors.stock?.message} />
                        </Grid>
                        <Grid item>
                            <Select
                                onChange={handleEstado}
                                value={estado}>
                                <MenuItem value={1} > Activo </MenuItem>
                                <MenuItem value={0} > Inactivo </MenuItem>
                            </Select>
                        </Grid>
                    </Grid>

                    <Grid item container spacing={1}>
                        <Grid item>
                            <TextField
                                label='Precio Compra'
                                {...register('precioCompra', validacion.peso)}
                                error={!!errors.precioCompra}
                                helperText={errors.precioCompra?.message} />
                        </Grid>
                        <Grid item>
                            <TextField
                                label='Precio Venta'
                                {...register('precioVenta', validacion.peso)}
                                error={!!errors.precioVenta}
                                helperText={errors.precioVenta?.message} />
                        </Grid>
                        <Grid item>
                            <TextField
                                label='Precio Suelto'
                                {...register('precioSuelto', validacion.peso)}
                                error={!!errors.precioSuelto}
                                helperText={errors.precioSuelto?.message} />
                        </Grid>
                    </Grid>
                </Grid>
                {errores.length > 0 && (
                    <FormHelperText error sx={{ marginTop: '1rem', display: 'block' }}>
                        {errores.join(', ')}
                    </FormHelperText>
                )}
                <Box component={'div'} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <Button onClick={() => navigate('../2')} variant="contained"> Atras </Button>
                    <Button type="submit" variant="contained"> Cargar </Button>
                </Box>
            </form>
        </Box>
    );
};

DatosPrecio.propTypes = {
    useCase: PropTypes.object.isRequired,
    nuevoProducto: PropTypes.object.isRequired,
    setNuevoProducto: PropTypes.func.isRequired,
    progreso: PropTypes.number.isRequired,
};