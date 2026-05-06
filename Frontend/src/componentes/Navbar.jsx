import { ExitToApp, Home, List, Person, ShoppingCart } from "@mui/icons-material";
import { Link, NavLink } from "react-router-dom";
import { MenuDrop } from "./varios";
import { useSelector } from "react-redux";



export const Navbar = () => {

    const usuario = useSelector(state => state.auth.usuario);


    return (
        <div className='contenedorNav'>
            <nav className='navbar'>
                <Link
                    className='navItem'
                    to='/productos'
                >
                    PuntoVet <Home />
                </Link>
                <div className='navSecciones'>
                    <NavLink
                        className='navItem'
                        to='/productos'
                    >
                        Productos <List />
                    </NavLink>

                    <NavLink
                        className='navItem'
                        to='/compras'
                    >
                        Compras <ShoppingCart />
                    </NavLink>

                    <NavLink
                        className='navItem'
                        to='/usuarios'
                    >
                        Usuarios <Person />
                    </NavLink>
                </div>
                <div>
                    <MenuDrop />
                </div>
            </nav>
        </div>
    )
};