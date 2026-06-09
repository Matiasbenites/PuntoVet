import { Route, Routes } from "react-router-dom";
import { ListaPage } from "../productos/paginas/ListaPage";
import { NuevoProducto } from "../productos/paginas/NuevoProducto";
import { RoleRoute } from "./RoleRoute";
import { ROLES } from "./roles";

// Router que maneja las rutas relacionadas con productos.
// Define dos rutas: lista de productos y formulario para crear/editar.
// Es parte del sistema privado, solo accesibles después del login.

export const ProductosRouter = () => {
    return (
        <>
            {/* <Navbar /> */}
            <Routes>
                <Route path="/productos/*" element={
                    <RoleRoute rolesPermitidos={[ROLES.ADMINISTRADOR, ROLES.VENDEDOR]}>
                        <ListaPage />
                    </RoleRoute>
                } />
                <Route path="/productos/nuevo/*" element={
                    <RoleRoute rolesPermitidos={[ROLES.ADMINISTRADOR]}>
                        <NuevoProducto />
                    </RoleRoute>
                } />
            </Routes>
        </>
    );
};
