import { Box, Container } from "@mui/material";
import { ButonAmarillo, ButonVerde, SectionHeader } from "../../componetes";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteUsuario, getUsuarios } from "../../api/usuariosApi";
import { ItemUsuario } from "../componentes";
import useSnackbarSimple from "../../componetes/varios/Snackbar";

export const ListUsuarios = () => {
    const [estadoUsuario, setEstadoUsuario] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const { ComponenteSnackbar, handleOpen } = useSnackbarSimple();

    const usuariosEliminados = () => {
        setEstadoUsuario(!!!estadoUsuario);
    }

    const buscarUsuario = () => {
        console.log('Buscando Usuario');
    }

    const bajaUsuario = async (codUsuario) => {
        console.log('Eliminando Usuario: ', codUsuario);
        try {
            const { message } = await deleteUsuario(codUsuario);
            handleOpen(message);
            setUsuarios(usuarios.filter(usuario => usuario.codUsuario !== codUsuario));
        } catch (error) {
            console.log('Error al eliminar el usuario');
        }

    }

    useEffect(() => {
        const listaUsuarios = async () => {
            try {
                const resultadoUsuarios = await getUsuarios(estadoUsuario);
                setUsuarios(resultadoUsuarios);
            }
            catch (error) {
                console.log('Error al cargar los usuarios');
            } finally {
                setCargando(false)
            }
        }
        listaUsuarios()
    }, [estadoUsuario])

    return (
        <Container>
            <SectionHeader>
                <div></div>
                {/* <Buscador parametro='usuarios' onChange={buscarUsuario} /> */}
                <Box>
                    <Link to={'nuevo'}> <ButonVerde> Nuevo Usuario </ButonVerde> </Link>
                    <ButonAmarillo onClick={usuariosEliminados}> {estadoUsuario ? 'Eliminados' : 'Activos'} </ButonAmarillo>
                </Box>
            </SectionHeader>
            {cargando ? <div>Cargando los usuarios </div> :
                <div className="scroll">
                    {
                        usuarios.length > 1 && usuarios?.map((usuario) => {
                            return <ItemUsuario key={usuario.codUsuario} usuario={usuario} bajaUsuario={bajaUsuario} />
                        })
                    }
                </div>
            }
            <ComponenteSnackbar />
        </Container >
    );
}