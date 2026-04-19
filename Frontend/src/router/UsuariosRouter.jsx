import { Route, Routes } from "react-router-dom"
import { ListUsuarios } from "../auth/paginas/ListUsuarios"
import { Navbar } from "../componetes"
import { NuevoUsuario } from "../auth/paginas"


export const UsuariosRouter = () => {
    return (

        <>
            {/* <Navbar /> */}
            <Routes>
                <Route path="/usuarios" element={<ListUsuarios />} />
                <Route path="/usuarios/nuevo" element={<NuevoUsuario />} />
            </Routes>
        </>
    )
}