import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { getRutaInicioPorRol, ROLES, usuarioTieneRol } from "./roles";

export const RoleRoute = ({ children, rolesPermitidos }) => {
    const usuario = useSelector(state => state.auth.usuario);

    if (!usuarioTieneRol(usuario, rolesPermitidos)) {
        return <Navigate to={getRutaInicioPorRol(usuario)} replace />;
    }

    return children;
};

export const DetalleTransaccionRoute = ({ children }) => {
    const { type } = useParams();
    const rolesPermitidos = type === 'compras'
        ? [ROLES.ADMINISTRADOR]
        : [ROLES.ADMINISTRADOR, ROLES.VENDEDOR];

    return (
        <RoleRoute rolesPermitidos={rolesPermitidos}>
            {children}
        </RoleRoute>
    );
};
