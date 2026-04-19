import { Navigate, Route, Routes } from "react-router-dom";
import { VentaPage } from "../ventas/paginas/VentaPage";
import { DetalleVentaPage } from "../ventas/paginas/DetalleVentaPage";
import { ListaVenta } from "../ventas/paginas/ListaVentas";





export const VentaRouter = () => {
    return (
        <Routes>
            <Route path="/ventas" element={<VentaPage />} />
            <Route path="/ventas/lista" element={<ListaVenta />} />
            {/* <Route path="/ventas/detalle/:codVenta" element={<DetalleVentaPage />} /> */}
            <Route path="/ventas/*" element={<Navigate to={'/ventas'} />} />
        </Routes>
    );
}