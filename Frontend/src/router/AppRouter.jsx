import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth/paginas";
import { ProductosRouter } from "./ProductosRouter";
import { UsuariosRouter } from "./UsuariosRouter";
import { LogoutPage } from "../auth/hook/LogoutPage";
import { PrivateRoute } from "./PrivateRoute";
import { Navbar } from "../componetes";
import { PublicRoute } from "./PublicRoute";
import { VentaRouter } from "./VentaRouter";
import '../styles';
import 'animate.css';
import { CompraRouter } from "./CompraRouter";
import { DetalleVentaPage } from "../ventas/paginas/DetalleVentaPage";

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/auth" element={
                <PublicRoute>
                    <LoginPage />
                </PublicRoute>
            } />

            <Route path="/auth/logout" element={<LogoutPage />} />

            <Route path="/*" element={
                <PrivateRoute>
                    <Navbar />
                    <CompraRouter />
                    <VentaRouter />
                    <ProductosRouter />
                    <UsuariosRouter />
                </PrivateRoute>
            } />

            <Route path="/:type/detalle/:cod" element={
                <PrivateRoute>
                    <DetalleVentaPage />
                </PrivateRoute>
            } />

            <Route path="/" element={<Navigate to={'/ventas'} />} />
        </Routes>
    );
};
