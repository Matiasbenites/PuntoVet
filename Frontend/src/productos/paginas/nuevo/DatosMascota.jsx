import { Box, Button, Checkbox, FormControlLabel, FormGroup, FormHelperText, Grid, Input, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { validacion } from "../../../componentes/validaciones";

export const DatosMascota = ({ useCase, nuevoProducto, setNuevoProducto, progreso, setProgreso }) => {
    // Tercer paso: selección de mascotas y edades.
    // Se muestran checkboxes para que el administrador elija a qué mascotas y edades aplica este producto.
    // Los códigos seleccionados se guardan en arrays para asociarlos al producto.
    const navigate = useNavigate();
    const [codMascotas, setcodMascotas] = useState(nuevoProducto.codMascotas ? nuevoProducto.codMascotas.map(String) : []);
    const [codEdades, setcodEdades] = useState(nuevoProducto.codEdades ? nuevoProducto.codEdades.map(String) : []);
    const [mascotas, setMascotas] = useState([]);
    const [edades, setEdades] = useState([]);
    const [errores, setErrores] = useState([]);
    const { handleSubmit, register, formState: { errors }, reset } = useForm({ defaultValues: nuevoProducto });

    useEffect(() => {
        reset(nuevoProducto);
    }, [nuevoProducto, reset]);

    useEffect(() => {
        if (progreso < 1) {
            navigate('/productos');
        }

        const cargarOpciones = async () => {
            const { mascotas: mascotasData, edades: edadesData } = await useCase.obtenerOpcionesFormularioProducto();
            setMascotas(mascotasData);
            setEdades(edadesData);
        };

        cargarOpciones();
    }, [progreso, navigate, useCase]);

    const onSubmit = async ({ imagen }) => {
        if (codMascotas.length === 0 || codEdades.length === 0) {
            setErrores(['Por favor seleccione mascotas y edades']);
            return;
        }

        const datosImagen = imagen?.[0];

        try {
            await useCase.avanzarPaso({ codMascotas, codEdades, imagen: datosImagen });
            setNuevoProducto(useCase.obtenerProducto());
            setProgreso(useCase.getPasoActual());
            navigate('../3');
        } catch (error) {
            setErrores([error.message]);
        }
    }

    const handlecodEdades = (event) => {
        const value = event.target.value.toString();
        if (codEdades.includes(value)) {
            setcodEdades(codEdades.filter((item) => item !== value));
        } else {
            setcodEdades([...codEdades, value]);
        }
    }

    const handlecodMascotas = (event) => {
        const value = event.target.value.toString();
        if (codMascotas.includes(value)) {
            setcodMascotas(codMascotas.filter((item) => item !== value));
        } else {
            setcodMascotas([...codMascotas, value]);
        }
    };


    return (
        <Box component={'section'} sx={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit(onSubmit)} >
                <Grid container spacing={5}>
                    <Grid item>
                        <Typography
                            variant="h7"
                            gutterBottom
                        >
                            Mascotas
                        </Typography>
                        <FormGroup
                            sx={{
                                display: 'flex',
                                flexDirection: 'row'
                            }} >
                            {mascotas.map((mascota) => (
                                <FormControlLabel
                                    key={mascota.codMascota}
                                    control={
                                        <Checkbox
                                            checked={codMascotas.includes(String(mascota.codMascota))}
                                            onChange={handlecodMascotas}
                                            value={String(mascota.codMascota)}
                                        />
                                    }
                                    label={mascota.nombreMascota}
                                />
                            ))}
                        </FormGroup>
                    </Grid>
                    <Grid item>
                        <Typography variant="h7" gutterBottom>Edades </Typography>
                        <FormGroup
                            sx={{ display: 'flex', flexDirection: 'row' }}>
                            {edades.map((edad) => (
                                <FormControlLabel
                                    key={edad.codEdad}
                                    control={
                                        <Checkbox
                                            checked={codEdades.includes(String(edad.codEdad))}
                                            onChange={handlecodEdades}
                                            value={String(edad.codEdad)}
                                        />
                                    }
                                    label={edad.nombreEdad}
                                />
                            ))}
                        </FormGroup>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="h7"
                            gutterBottom
                            sx={{ display: 'block' }}
                        >
                            Imagen [ JPEG / PNG ]
                        </Typography>

                        <Input
                            type="file"
                            variant="outlined"
                            error={!!errors.imagen}
                            {...register('imagen', validacion.imagen)}
                        />
                        {errors.imagen && <FormHelperText> {errors.imagen?.message} </FormHelperText>}
                        {/* <TextField
                            type="file"
                        /> */}
                    </Grid>
                </Grid>
                {errores.length > 0 && (
                    <FormHelperText error sx={{ marginTop: '1rem', display: 'block' }}>
                        {errores.join(', ')}
                    </FormHelperText>
                )}
                <Box component={'div'} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <Button onClick={() => navigate('../1')} variant="contained"> Atras </Button>
                    <Button type="submit" variant="contained"> Siguiente </Button>
                </Box>
            </form>
        </Box>
    );
};