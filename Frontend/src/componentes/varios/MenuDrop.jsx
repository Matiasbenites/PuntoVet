import { KeyboardArrowDown, Person } from "@mui/icons-material";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { menuDropStyle } from "../../layout/styles";
import { useSelector } from "react-redux";




export const MenuDrop = () => {

    const [visible, setVisible] = useState(null);
    const open = Boolean(visible);
    const usuario = useSelector(state => state.auth.usuario);

    const handleClick = (event) => {
        setVisible(event.currentTarget);
    };

    const handleClose = () => {
        setVisible(null);
    };

    return (
        <div >
            <Button
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={menuDropStyle.root}
            >
                {usuario.nombreApellido} <KeyboardArrowDown />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={visible}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <NavLink
                    to={'/auth/logout'}
                >
                    <MenuItem
                        sx={{ width: '100%' }}
                        onClick={handleClose}>
                        Cerrar Sesion
                    </MenuItem>
                </NavLink>

                <NavLink
                    to={'/productos'}
                >
                    <MenuItem
                        sx={{ width: '100%' }}
                        onClick={handleClose}>
                        Estadisticas
                    </MenuItem>
                </NavLink>

            </Menu>
        </div >
    );
}