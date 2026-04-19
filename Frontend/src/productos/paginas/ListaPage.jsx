import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { BuscadorProductos, ButonAmarillo, ButonVerde, SectionHeader } from "../../componetes";
import { useEffect, useRef, useState } from "react";
import { ItemProducto } from "../componentes/ItemProducto";
import { Link, useLocation } from "react-router-dom";
import { ProductoModal } from "../componentes/ProductoModal";
import { deleteProducto, getProductos } from "../../api/productos/productosApi";
import useSnackbarSimple from "../../componetes/varios/Snackbar";

export const ListaPage = () => {
    const limite = 15;
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const mensaje = location.state?.mensaje
    const [productos, setProductos] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [productoEstado, setProductoEstado] = useState(true);
    const elementRef = useRef();
    const [buscando, setBuscando] = useState(false);

    const { ComponenteSnackbar, handleOpen } = useSnackbarSimple();

    const verProducto = (producto) => {
        setProductoSeleccionado(producto);
        setOpen(true);
    }

    const productosEliminados = () => {
        const nuevoEstado = !productoEstado;
        setProductoEstado(nuevoEstado);
        setProductos([]);
        setPage(1);
        setHasMore(true);
    }

    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection)
        if (observer && elementRef.current) {
            observer.observe(elementRef.current);
        }
        return () => {
            if (observer) {
                observer.disconnect();
            }
        }
    }, [page, productoEstado]);

    const onIntersection = (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasMore) {
            moreItems();
        }
    }

    async function moreItems() {
        setTimeout(async () => {
            const data = await getProductos(page, limite, productoEstado)
            if (data.length === 0) {
                setHasMore(false);
            } else {
                setProductos([...productos, ...data]);
                setPage(page + 1);
            }
        }, 700)
    };

    const onBuscadorProducto = (busqueda) => {

        if (busqueda.length > 0) {
            setProductos(busqueda);
            setBuscando(true);
        } else {
            setProductos([])
            setBuscando(false);
            setPage(1);
            moreItems();
        }

        console.log(busqueda);
    }

    const eliminarProducto = async (codProducto) => {
        try {
            const { message } = await deleteProducto(codProducto);
            console.log(message);
            handleOpen(message);
            setProductos(productos.filter((p) => p.codProducto !== codProducto));
        } catch (error) {
            console.log('Error al eliminar el producto: ', error);
        }
    }

    return (
        <>
            <Container>
                {mensaje && <Typography variant="h3"> {mensaje} </Typography>}
                <SectionHeader>
                    <BuscadorProductos onProductosObtenidos={onBuscadorProducto} />
                    {/* <Buscador parametro='un producto' onSearch={buscadorProducto} /> */}
                    <Box component='div' display={'flex'} gap={2} >
                        <Link to={'nuevo'}> <ButonVerde> Nuevo Producto </ButonVerde> </Link>
                        <ButonAmarillo onClick={productosEliminados}> {productoEstado ? 'Eliminados' : 'Activos'} </ButonAmarillo>
                    </Box>
                </SectionHeader>
                <div className="scroll">
                    {
                        productos && productos.length > 0 && productos.map((p) => {
                            return <ItemProducto
                                key={p.codProducto}
                                productos={p} verProducto={verProducto}
                                productoEstado={productoEstado}
                                eliminarProducto={eliminarProducto}
                            />
                        })
                    }
                    {(hasMore && buscando != true) ? <div ref={elementRef} style={{ textAlign: 'center' }}><CircularProgress sx={{ color: 'red' }} /></div> : ''}
                    {<ProductoModal open={open} setOpen={setOpen} producto={productoSeleccionado} />}
                </div>
                <ComponenteSnackbar />
            </Container>
        </>
    );
};