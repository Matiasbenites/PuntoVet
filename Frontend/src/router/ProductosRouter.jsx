import { Route, Routes } from "react-router-dom";
import { ListaPage } from "../productos/paginas/ListaPage";
import { NuevoProducto } from "../productos/paginas/NuevoProducto";
import { Navbar } from "../componetes";


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