import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, TextField, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { validacion } from "../../../componentes/validaciones";
import { Producto } from "../../../modelos/Producto";
import { getCategoria, getTamanio } from "../../../api/catalogos/catalogosApi";


export const DatosCategoria = ({ nuevoProducto, setNuevoProducto, progreso, setProgreso }) => {
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

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: nuevoProducto });

    useEffect(() => {
        const cargarCatálogo = async () => {
            const [categoriasData, tamaniosData] = await Promise.all([getCategoria(), getTamanio()]);
            setCategorias(categoriasData);
            setTamanios(tamaniosData);
        };

        cargarCatálogo();
    }, []);

    const handleChangecodCategoria = (event) => {
        setcodCategoria(event.target.value);
    }

    const handleChangecodTamanio = (event) => {
        setTamaio(event.target.value);
    }

    const onSubmit = ({ codCategoria, peso, mililitro, cantidad, codTamanio }) => {
        const productoActualizado = Producto.from(nuevoProducto);
        productoActualizado.setProducto({ codCategoria, peso, mililitro, cantidad, codTamanio });
        setNuevoProducto(productoActualizado.obtenerEntidad());
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
                                    {...register('codCategoria', validacion.categoria)}
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
                                <TextField
                                    type='number'
                                    label='Unidades'
                                    {...register('cantidad', validacion.unidades)}
                                    error={!!errors.unidades}
                                    helperText={errors.unidades?.message} />
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="selectTamanio">Tamañio</InputLabel>
                                    <Select
                                        {...register('codTamanio', validacion.tamanio)}
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
                    <Box component={'div'} sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <Button onClick={() => navigate('../')} variant="contained"> Atras </Button>
                        <Button type="submit" variant="contained"> Siguiente </Button>
                    </Box>
                </form>
            </Grid>
        </Box>
    );
};