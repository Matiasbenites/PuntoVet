import { Navigate, Route, Routes } from "react-router-dom";
import { VentaPage } from "../ventas/paginas/VentaPage";
import { DetalleVentaPage } from "../ventas/paginas/DetalleVentaPage";
import { ListaVenta } from "../ventas/paginas/ListaVentas";
import { RoleRoute } from "./RoleRoute";
import { ROLES } from "./roles";





export const VentaRouter = () => {
    return (
        <Routes>
            <Route path="/ventas" element={
                <RoleRoute rolesPermitidos={[ROLES.ADMINISTRADOR, ROLES.VENDEDOR]}>
                    <VentaPage />
                </RoleRoute>
            } />
            <Route path="/ventas/lista" element={
                <RoleRoute rolesPermitidos={[ROLES.ADMINISTRADOR]}>
                    <ListaVenta />
                </RoleRoute>
            } />
            <Route path="/ventas/detalle/:codVenta" element={
                <RoleRoute rolesPermitidos={[ROLES.ADMINISTRADOR, ROLES.VENDEDOR]}>
                    <DetalleVentaPage />
                </RoleRoute>
            } />
            {/* <Route path="/ventas/detalle/:cod" element={<DetalleVentaPage />} /> */}
            <Route path="/ventas/*" element={<Navigate to={'/ventas'} />} />
        </Routes>
    );
}
