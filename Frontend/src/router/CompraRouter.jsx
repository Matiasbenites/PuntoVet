import { Navigate, Route, Routes } from "react-router-dom"
import { CompraPage } from "../compras/pages/CompraPage"
import { DetalleVentaPage } from "../ventas/paginas/DetalleVentaPage"
import { ListaTransacciones } from "../componetes/paginas/ListaTransacciones"




export const CompraRouter = () => {
    return (
        <Routes>
            <Route path="/compras" element={<CompraPage />} />
            <Route path="/compras/lista" element={<ListaTransacciones />} />
        </Routes>
    )
}