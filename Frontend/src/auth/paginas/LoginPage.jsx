import { useTheme } from "@emotion/react";
import { CardMedia, Checkbox, Container, FormControlLabel, Grid, Typography } from "@mui/material";
import { ContenedorLayout } from "../../layout/ContenedorLayout";
import { ButonAzul, InputBlanco } from "../../componetes";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/usuariosApi";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../redux/slices/auth/authSlice";
import { useState } from "react";


export const LoginPage = () => {
    const theme = useTheme()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const usuario = useSelector(state => state.auth.usuario);
    const { register, handleSubmit } = useForm();
    const { root } = theme;
    const [mantenerSesion, setMantenerSesion] = useState(false);
    const [message, setMessage] = useState('')


    const onLogin = async (responce) => {
        const { status, data: { message, datos } } = responce;
        if (status === 200) {
            dispatch(setAuth({ usuario: datos }));
            (mantenerSesion) && localStorage.setItem('user', JSON.stringify(datos))
            navigate('/ventas', { replace: true });
        } else {
            setMessage(message);
            setTimeout(() => {
                setMessage('')
            }, 3000);
        }
    }

    const onSubmit = async (values) => {
        try {
            const responce = await login(values);
            await onLogin(responce);
        } catch (error) {
            setMessage('Error de conexion: ', error.message);
        }
    }
    return (
        <>
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ContenedorLayout>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid
                            container
                            sx={{
                                bgcolor: '#FFFFFF',
                                borderRadius: '2rem'
                            }}
                        >
                            <Grid item sm={6} bgcolor={root.azulVerdoso} padding={10} sx={{ borderRadius: '2rem  0rem 0rem 2rem' }}>
                                <Typography variant="h1" sx={{ fontSize: '5rem' }} textAlign={"center"}> Iniciar Sesion </Typography>
                                <Grid marginTop={5}>
                                    <InputBlanco {...register('usuario')} label="Usuario" fullWidth />
                                </Grid>
                                <Grid marginTop={4}>
                                    <InputBlanco {...register('password')} label="Password" fullWidth type="password" />
                                    <Typography variant="h6" color="error">{message}</Typography>
                                </Grid>
                                <Grid marginTop={10}>
                                    <FormControlLabel
                                        control={<Checkbox />}
                                        label="Mantener la sesion iniciada"
                                        onChange={(e) => setMantenerSesion(e.target.checked)}
                                    />
                                </Grid>
                                <Grid marginTop={10} textAlign='center'>
                                    <ButonAzul type="submit">Iniciar Sesion</ButonAzul>
                                </Grid>
                            </Grid>
                            <Grid item sm={6} padding={1}>
                                <CardMedia component='img' alt="Vet Safe" image="../../../img/logo.jpeg" />
                            </Grid>
                        </Grid>
                    </form>
                </ContenedorLayout>
            </Container>
        </>


    );
};