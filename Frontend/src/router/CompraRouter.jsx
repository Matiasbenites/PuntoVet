import { Route, Routes } from "react-router-dom"
import { CompraPage } from "../compras/pages/CompraPage"
import { DetalleVentaPage } from "../ventas/paginas/DetalleVentaPage"
import { ListaTransacciones } from "../componentes/paginas/ListaTransacciones"
import { RoleRoute } from "./RoleRoute"
import { ROLES } from "./roles"

export const CompraRouter = () => {
    return (
        <Routes>
            <Route path="/compras" element={
                <RoleRoute rolesPermitidos={[ROLES.ADMINISTRADOR]}>
                    <CompraPage />
                </RoleRoute>
            } />
            <Route path="/compras/lista" element={
                <RoleRoute rolesPermitidos={[ROLES.ADMINISTRADOR]}>
                    <ListaTransacciones />
                </RoleRoute>
            } />
            <Route path="/compras/detalle/:cod" element={
                <RoleRoute rolesPermitidos={[ROLES.ADMINISTRADOR]}>
                    <DetalleVentaPage />
                </RoleRoute>
            } />
        </Routes>
    )
}
