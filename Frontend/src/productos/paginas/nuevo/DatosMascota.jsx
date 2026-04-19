import { Box, Button, Checkbox, FormControlLabel, FormGroup, FormHelperText, Grid, Input, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { validacion } from "../../../componetes/validaciones";



export const DatosMascota = ({ nuevoProducto, setNuevoProducto, progreso, setProgreso }) => {
    const navigate = useNavigate();
    const [codMascotas, setcodMascotas] = useState(nuevoProducto.codMascotas ? nuevoProducto.codMascotas.map(String) : []);
    const [codEdades, setcodEdades] = useState(nuevoProducto.codEdades ? nuevoProducto.codEdades.map(String) : []);
    const { handleSubmit, register, formState: { errors } } = useForm({ defaultValues: nuevoProducto });


    useEffect(() => {
        if (progreso < 1) {
            console.log(progreso);
            navigate('/productos');
        }
    }, [progreso, navigate]);

    const onSubmit = ({ imagen }) => {
        if (codMascotas.length === 0 || codEdades.length === 0) {
            alert('Por favor seleccione una codMascotas y el rango de codEdades')
            return;
        }

        const datosImagen = imagen[0]

        setNuevoProducto({ ...nuevoProducto, codMascotas, codEdades, imagen: datosImagen })
        console.log(imagen);
        setProgreso(progreso + 1);
        navigate('../3');
    }

    const handlecodEdades = (event) => {
        const value = event.target.value.toString();
        if (codEdades.includes(value)) {
            setcodEdades(codEdades.filter((item) => item != value));
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
                            <FormControlLabel control={<Checkbox checked={codMascotas.includes('1')} onChange={handlecodMascotas} value={'1'} />} label="Perro" />
                            <FormControlLabel control={<Checkbox checked={codMascotas.includes('2')} onChange={handlecodMascotas} value={'2'} />} label="Gato" />
                            <FormControlLabel control={<Checkbox checked={codMascotas.includes('3')} onChange={handlecodMascotas} value={'3'} />} label="Ave" />
                            <FormControlLabel control={<Checkbox checked={codMascotas.includes('4')} onChange={handlecodMascotas} value={'4'} />} label="Otros" />
                        </FormGroup>
                    </Grid>
                    <Grid item>
                        <Typography variant="h7" gutterBottom>Edades </Typography>
                        <FormGroup
                            sx={{ display: 'flex', flexDirection: 'row' }}>
                            <FormControlLabel control={<Checkbox checked={codEdades.includes('1')} onChange={handlecodEdades} value={'1'} />} label="Cachorro" />
                            <FormControlLabel control={<Checkbox checked={codEdades.includes('2')} onChange={handlecodEdades} value={'2'} />} label="Castrado" />
                            <FormControlLabel control={<Checkbox checked={codEdades.includes('3')} onChange={handlecodEdades} value={'3'} />} label="Joven" />
                            <FormControlLabel control={<Checkbox checked={codEdades.includes('4')} onChange={handlecodEdades} value={'4'} />} label="Adulto" />
                            <FormControlLabel control={<Checkbox checked={codEdades.includes('5')} onChange={handlecodEdades} value={'5'} />} label="Mayor" />
                            <FormControlLabel control={<Checkbox checked={codEdades.includes('6')} onChange={handlecodEdades} value={'6'} />} label="Urinario" />
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

                <Box component={'div'} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <Button onClick={() => navigate('../1')} variant="contained"> Atras </Button>
                    <Button type="submit" variant="contained"> Siguiente </Button>
                </Box>
            </form>
        </Box>
    );
};