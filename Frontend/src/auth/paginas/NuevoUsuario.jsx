import { Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { set, useForm } from "react-hook-form";
import { validacionesUsuario } from "../../validaciones";
import { ButonVerde, TituloFormularioPrincipales } from "../../componetes";
import { useEffect, useState } from "react";
import { ContenedorFormulariosPrincipales } from "../../layout";
import { getUsuario, setUsuario, updateUsuario } from "../../api/usuariosApi";
import { useLocation, useNavigate } from "react-router-dom";


export const NuevoUsuario = () => {
    const [mensaje, setMensaje] = useState('');
    const [nuevoUsuario, setNuevoUsuario] = useState({});
    const [codTipoUsuario, setCodTipoUsuario] = useState(2);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: nuevoUsuario });

    const codUsuario = location.state?.codUsuario;

    useEffect(() => {
        const obtenerUsuario = async () => {
            if (codUsuario) {
                try {
                    const usuario = await getUsuario(codUsuario);
                    setNuevoUsuario(usuario);
                    reset(usuario)
                } catch (error) {
                    console.log('Error al cargar el usuario');
                }
            }
            setLoading(false);
        }
        obtenerUsuario();
    }, [codUsuario, reset])

    useEffect(() => {
        if (mensaje != '')
            setTimeout(() => navigate('/usuarios'), 3000);
    }, [mensaje])

    const onSubmit = async (data) => {
        try {
            if (nuevoUsuario.codUsuario) {
                const responce = await updateUsuario(data, nuevoUsuario.codUsuario);
                setMensaje(responce.message)
            } else {
                setNuevoUsuario(data);
                const responce = await setUsuario(data);
                setMensaje(responce.message)
            }
        } catch (error) {
            setMensaje(error.message)
        }

    }

    const cambiarTipoUsuario = (event) => {
        setCodTipoUsuario(event.target.value);
    }

    if (loading) {
        return <div> Cargando wey.... </div>
    }

    return (
        <ContenedorFormulariosPrincipales>
            <Container>
                <TituloFormularioPrincipales titulo={'Nuevo Usuario'} />
                <form style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={1}>
                        <Grid item sm={6} >
                            <TextField
                                sx={{ margin: '2rem' }}
                                fullWidth
                                label={'Nombre y apellido'}
                                {...register('nombreApellido', validacionesUsuario.nombre)}
                                error={!!errors.nombre}
                                helperText={errors.nombre?.message}
                            />

                            <TextField
                                sx={{ margin: '2rem' }}
                                fullWidth
                                label={'Celular'}
                                {...register('celular', validacionesUsuario.celular)}
                                error={!!errors.celular}
                                helperText={errors.celular?.message}
                            />

                            <FormControl
                                fullWidth
                                sx={{ margin: '2rem' }}
                            >
                                <InputLabel id="codTipoUsuario">Tipo Usuario</InputLabel>
                                <Select
                                    {...register('codTipoUsuario')}
                                    labelId="codTipoUsuaio"
                                    value={codTipoUsuario}
                                    label="Categoria"
                                    onChange={cambiarTipoUsuario}
                                    error={!!errors.categoria}
                                >
                                    <MenuItem value={1}>Administrador</MenuItem>
                                    <MenuItem value={2}>Vendedor</MenuItem>
                                </Select>
                                {errors.codCategoria && <FormHelperText sx={{ color: 'red' }}> {errors.codCategoria?.message} </FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item sm={6}>

                            <TextField
                                sx={{ margin: '2rem' }}
                                fullWidth
                                label={'Nombre de Usuario'}
                                {...register('user', validacionesUsuario.usuario)}
                                error={!!errors.usuario}
                                helperText={errors.usuario?.message}
                            />

                            <TextField
                                sx={{ margin: '2rem' }}
                                fullWidth
                                type="password"
                                label={'Password'}
                                {...register('password', validacionesUsuario.password)}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />

                            <TextField
                                sx={{ margin: '2rem' }}
                                fullWidth
                                type="password"
                                label={'Confirmar Password'}
                                {...register('confirmPassword', {
                                    ...validacionesUsuario.passwordConfirm,
                                    validate: (value) => value === watch('password') || 'Las contraseñas no coinciden'
                                }
                                )}
                                error={!!errors.passwordConfirm || !!errors.confirmPassword}
                                helperText={errors.passwordConfirm?.message || errors.confirmPassword?.message}
                            />

                        </Grid>
                    </Grid>
                    <ButonVerde type="submit">Cargar Usuario </ButonVerde>
                </form>
                {mensaje != '' && <Typography variant="h6" sx={{ color: 'green' }}>{mensaje}</Typography>}
            </Container>
        </ContenedorFormulariosPrincipales>
    )
}