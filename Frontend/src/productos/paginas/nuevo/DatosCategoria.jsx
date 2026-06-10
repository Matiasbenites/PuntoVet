import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, TextField, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { validacion } from "../../../componentes/validaciones";

export const DatosCategoria = ({ useCase, nuevoProducto, setNuevoProducto, progreso, setProgreso }) => {
    // Segundo paso del formulario para seleccionar categoría, peso, medidas y tamaño.
    // Se valida que la categoría esté seleccionada y los campos numéricos sean válidos.
    // Al finalizar, se guarda la información y se avanza al siguiente paso.

    const navigate = useNavigate();

    useEffect(() => {
        if (progreso < 0) {
            console.log(progreso);
            navigate('/productos');
        }
    }, [progreso, navigate]);

    const { codCategoria: codCategoriaEstado } = nuevoProducto;

    const [codCategoria, setcodCategoria] = useState(codCategoriaEstado);
    const [codTamanio, setTamaio] = useState(nuevoProducto.codTamanio ?? '');
    const [categorias, setCategorias] = useState([]);
    const [tamanios, setTamanios] = useState([]);
    const [errores, setErrores] = useState([]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues: nuevoProducto });

    const { onChange: onChangeCategoriaRHF, ...restCategoria } = register('codCategoria', validacion.categoria);
    const { onChange: onChangeTamanioRHF, ...restTamanio } = register('codTamanio', validacion.tamanio);

    useEffect(() => {
        reset(nuevoProducto);
    }, [nuevoProducto, reset]);

    useEffect(() => {
        const cargarCatalogo = async () => {
            const { categorias: categoriasData, tamanios: tamaniosData } = await useCase.obtenerOpcionesFormularioProducto();
            setCategorias(categoriasData);
            setTamanios(tamaniosData);
        };

        cargarCatalogo();
    }, [useCase]);

    const handleChangecodCategoria = (event) => {
        setcodCategoria(event.target.value);
        onChangeCategoriaRHF(event);
    }

    const handleChangecodTamanio = (event) => {
        setTamaio(event.target.value);
        onChangeTamanioRHF(event);
    }

    const onSubmit = ({ codCategoria, peso, mililitro, codTamanio }) => {
        setNuevoProducto({ ...nuevoProducto, codCategoria, peso, mililitro, codTamanio })
        setProgreso(progreso + 1);
        navigate('../2')
    }

    return (
        <Box component={'section'} sx={{ padding: '2rem' }}>
            <Grid >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item sm={12}>
                            <FormControl fullWidth>
                                <InputLabel id="codCategoria">Categoria</InputLabel>
                                <Select
                                    {...restCategoria}
                                    labelId="codCategoria"
                                    value={codCategoria}
                                    label="Categoria"
                                    onChange={handleChangecodCategoria}
                                    error={!!errors.categoria}
                                >
                                    {categorias.map((categoria) => (
                                        <MenuItem key={categoria.codCategoria} value={categoria.codCategoria}>
                                            {categoria.nombreCategoria}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.codCategoria && <FormHelperText sx={{ color: 'red' }}> {errors.codCategoria?.message} </FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item container spacing={1} >
                            <Grid item xs={3}>
                                <TextField
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                    label='Peso'
                                    {...register('peso', validacion.peso)}
                                    error={!!errors.peso}
                                    helperText={errors.peso?.message} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    type="number" label='Mililitros'
                                    {...register('mililitro', validacion.mililitros)}
                                    error={!!errors.mililitros}
                                    helperText={errors.mililitros?.message} />
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="selectTamanio">Tamañio</InputLabel>
                                    <Select
                                        {...restTamanio}
                                        fullWidth
                                        labelId="selectTamanio"
                                        value={codTamanio}
                                        label="codTamanio"
                                        onChange={handleChangecodTamanio}
                                        error={!!errors.tamanio}
                                    >
                                        {tamanios.map((tamanio) => (
                                            <MenuItem key={tamanio.codTamanio} value={tamanio.codTamanio}>
                                                {tamanio.nombreTamanio}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.codTamanio && <FormHelperText> {errors.codTamanio?.message} </FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    {errores.length > 0 && (
                        <FormHelperText error sx={{ marginTop: '1rem', display: 'block' }}>
                            {errores.join(', ')}
                        </FormHelperText>
                    )}
                    <Box component={'div'} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <Button onClick={() => navigate('../')} variant="contained"> Atras </Button>
                        <Button type="submit" variant="contained"> Siguiente </Button>
                    </Box>
                </form>
            </Grid>
        </Box>
    );
};