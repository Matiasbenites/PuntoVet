USE punto_vet;
DELIMITER //
CREATE PROCEDURE BuscarProductos(IN param VARCHAR(255), IN limite INT, IN offset INT, IN v_estado BINARY)
BEGIN
    IF param IS NULL THEN
        SET param = ''; -- Si param es NULL, asigna una cadena vacía
    END IF;
    IF limite IS NULL THEN
        SET limite = 1000;
    END IF;
    IF offset IS NULL THEN
        SET offset = 0;
    END IF;
	IF v_estado IS NULL THEN
		SET v_estado = 1;
    END IF;

    SELECT p.codProducto, p.nombre, p.descripcion, p.peso, p.mililitro, p.cantidad, p.estado, p.imagen, p.stock, p.precioContado, p.precioLista, p.precioSuelto,
       c.nombreCategoria, 
       GROUP_CONCAT(distinct e.nombreEdad SEPARATOR ' - ') AS edades,
       GROUP_CONCAT(distinct m.nombreMascota SEPARATOR ' - ') AS mascotas,
       t.nombreTamanio
    FROM producto p
    LEFT JOIN categoria c ON c.codCategoria = p.codCategoria
    LEFT JOIN producto_edad pe ON pe.codProducto = p.codProducto
    LEFT JOIN producto_mascota pm ON pm.codProducto = p.codProducto
    LEFT JOIN mascota m ON m.codMascota = pm.codMascota
    LEFT JOIN edad e ON e.codEdad = pe.codEdad
    LEFT JOIN tamanio t ON t.codTamanio = p.codTamanio
    WHERE (p.codProducto = param OR p.nombre LIKE CONCAT('%', param, '%') OR c.nombreCategoria LIKE CONCAT('%', param, '%') OR m.nombreMascota LIKE CONCAT('%', param, '%') OR e.nombreEdad LIKE CONCAT('%', param, '%') OR param = '' OR param = ' ') AND (p.estado = v_estado)
    GROUP BY p.codProducto, p.nombre
    ORDER BY p.nombre 
    LIMIT limite OFFSET offset;
END //
DELIMITER ;


CALL BuscarProductos('7 vidas', NULL, NULL, true);


