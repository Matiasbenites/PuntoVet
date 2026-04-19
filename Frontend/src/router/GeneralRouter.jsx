import { Navigate, Route, Routes } from "react-router-dom"
import { DetalleVentaPage } from "../ventas/paginas/DetalleVentaPage"


export const GeneralRouter = () => {
    return (
        <Routes>
            <Route path="/:type/detalle/:cod" element={<DetalleVentaPage />} />
            <Route path="/*" element={<Navigate to={'/'} />} />
        </Routes>
    )
}