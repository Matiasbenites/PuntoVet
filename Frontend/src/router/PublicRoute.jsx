import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getRutaInicioPorRol } from "./roles";




export const PublicRoute = ({ children }) => {

    const autenticate = useSelector(state => state.auth.isAutenticated);
    const usuario = useSelector(state => state.auth.usuario);

    return (
        (!autenticate)
            ? children
            : <Navigate to={getRutaInicioPorRol(usuario)} />
    )
}
