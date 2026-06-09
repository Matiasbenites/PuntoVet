import { Route, Routes } from "react-router-dom"
import { ListUsuarios } from "../auth/paginas/ListUsuarios"
import { NuevoUsuario } from "../auth/paginas"
import { RoleRoute } from "./RoleRoute"
import { ROLES } from "./roles"


export const UsuariosRouter = () => {
    return (

        <>
            {/* <Navbar /> */}
            <Routes>
                <Route path="/usuarios" element={
                    <RoleRoute rolesPermitidos={[ROLES.ADMINISTRADOR]}>
                        <ListUsuarios />
                    </RoleRoute>
                } />
                <Route path="/usuarios/nuevo" element={
                    <RoleRoute rolesPermitidos={[ROLES.ADMINISTRADOR]}>
                        <NuevoUsuario />
                    </RoleRoute>
                } />
            </Routes>
        </>
    )
}
