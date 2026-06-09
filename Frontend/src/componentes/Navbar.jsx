import { ExitToApp, Home, List, Person, ShoppingCart } from "@mui/icons-material";
import { Link, NavLink } from "react-router-dom";
import { MenuDrop } from "./varios";
import { useSelector } from "react-redux";
import { getRutaInicioPorRol, ROLES, usuarioTieneRol } from "../router/roles";



export const Navbar = () => {

    const usuario = useSelector(state => state.auth.usuario);
    const esAdministrador = usuarioTieneRol(usuario, [ROLES.ADMINISTRADOR]);
    const puedeVender = usuarioTieneRol(usuario, [ROLES.ADMINISTRADOR, ROLES.VENDEDOR]);
    const puedeVerProductos = usuarioTieneRol(usuario, [ROLES.ADMINISTRADOR, ROLES.VENDEDOR]);


    return (
        <div className='contenedorNav'>
            <nav className='navbar'>
                <Link
                    className='navItem'
                    to={getRutaInicioPorRol(usuario)}
                >
                    PuntoVet <Home />
                </Link>
                <div className='navSecciones'>
                    {puedeVerProductos && (
                        <NavLink
                            className='navItem'
                            to='/productos'
                        >
                            Productos <List />
                        </NavLink>
                    )}

                    {esAdministrador && (
                        <NavLink
                            className='navItem'
                            to='/compras'
                        >
                            Compras <ShoppingCart />
                        </NavLink>
                    )}

                    {puedeVender && (
                        <NavLink
                            className='navItem'
                            to='/ventas'
                        >
                            Ventas <ShoppingCart />
                        </NavLink>
                    )}

                    {esAdministrador && (
                        <NavLink
                            className='navItem'
                            to='/usuarios'
                        >
                            Usuarios <Person />
                        </NavLink>
                    )}
                </div>
                <div>
                    <MenuDrop />
                </div>
            </nav>
        </div>
    )
};
