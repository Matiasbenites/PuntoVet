import { Route, Routes } from "react-router-dom";
import { ListaPage } from "../productos/paginas/ListaPage";
import { NuevoProducto } from "../productos/paginas/NuevoProducto";
import { Navbar } from "../componentes";

// Router que maneja las rutas relacionadas con productos.
// Define dos rutas: lista de productos y formulario para crear/editar.
// Es parte del sistema privado, solo accesibles después del login.

export const ProductosRouter = () => {
    return (
        <>
            {/* <Navbar /> */}
            <Routes>
                <Route path="/productos/*" element={<ListaPage />} />
                <Route path="/productos/nuevo/*" element={<NuevoProducto />} />
            </Routes>
        </>
    );
};