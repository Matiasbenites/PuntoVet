import { useEffect, useState } from "react";
import { valoresCard } from "../hooks/case";
import { Avatar, Card, CardActions, CardContent, CardHeader, Collapse, Typography } from "@mui/material";
import { ExpandMore, ShoppingBag } from "@mui/icons-material";

export const CardProducto = ({ nuevoProducto }) => {
    const {
        nombre, descripcion, stock, peso, cantidad, mililitro, precioCompra, precioVenta, precioSuelto,
        codCategoria, nombreCategoria,
        codTamanio, nombreTamanio,
        nombreMascotas, codMascotas,
        codEdades, nombreEdades
    } = nuevoProducto;

    const [expanded, setExpanded] = useState(false);
    const [retorno, setRetorno] = useState(valoresCard(codCategoria, codMascotas, codEdades, codTamanio))
    const [c, m, e, t] = retorno;

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        setRetorno(valoresCard(codCategoria, codMascotas, codEdades, codTamanio))
    }, [nuevoProducto])

    console.log(nombreMascotas);
    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar> <ShoppingBag /> </Avatar>
                }
                title={nombre}
                subheader={retorno[0]}
            />
            <CardContent>
                <Typography> Stock: <b>{stock}</b> </Typography>
                <Typography> Peso: <b>{peso}</b> </Typography>
                <Typography> Tamaño: <b>{retorno[3]}</b> </Typography>
                <Typography> Cantidad: <b>{cantidad}</b> </Typography>
                <Typography> Mililitro: <b>{mililitro}</b> </Typography>
                <Typography> Para: <b>{retorno[1]}</b> </Typography>
                <Typography> Edad: <b>{retorno[2]}</b> </Typography>
                <hr />
                <Typography> Precio Compra: <b>$ {precioCompra}</b> </Typography>
                <Typography> Precio Venta: <b>$ {precioVenta}</b> </Typography>
                <Typography> Precio Suelto: <b>$ {precioSuelto}</b> </Typography>
            </CardContent>

            <CardActions>
                <ExpandMore expand={expanded.toString()} onClick={handleExpandClick} aria-expanded={expanded} aria-label="Descripcion"><ExpandMore /></ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ overflow: 'scroll' }}>
                    <Typography paragraph>
                        {descripcion}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}