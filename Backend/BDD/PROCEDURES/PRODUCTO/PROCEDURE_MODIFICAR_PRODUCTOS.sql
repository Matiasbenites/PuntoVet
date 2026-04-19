DELIMITER //

CREATE PROCEDURE ModificarProducto(IN productoJSON JSON)
BEGIN 
    DECLARE cod_producto INT;
    DECLARE cod_categoria INT;
    DECLARE nombre_producto VARCHAR(255);
    
    -- Obtener el código de producto, código de categoría y nombre del JSON
    SET cod_producto = JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.codProducto'));
    SET cod_categoria = JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.codCategoria'));
    SET nombre_producto = JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.nombre'));
    
    -- Verificar si el código de producto, categoría y nombre son nulos o vacíos
    IF cod_producto IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El código del producto es obligatorio';
    END IF;
    
    IF cod_categoria IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El código de categoría del producto es obligatorio';
    END IF;
    
    IF nombre_producto IS NULL OR nombre_producto = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre del producto es obligatorio';
    END IF;

    -- Actualizar la tabla producto con los valores proporcionados
    UPDATE producto
    SET codCategoria = cod_categoria,
        codTamanio = IF(JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.codTamanio')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.codTamanio'))),
        nombre = nombre_producto,
        descripcion = JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.descripcion')),
        peso = IF(JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.peso')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.peso'))),
        mililitro = IF(JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.mililitro')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.mililitro'))),
        cantidad = IF(JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.cantidad')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.cantidad'))),
        imagen = IF(JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.imagen')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.imagen'))),
        stock = JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.stock')),
        precioContado = JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.precioContado')),
        precioLista = JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.precioLista')),
        precioSuelto = JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.precioSuelto'))
    WHERE codProducto = cod_producto;

    -- Borrar las relaciones existentes en las tablas producto_edad y producto_mascota
    DELETE FROM producto_edad WHERE codProducto = cod_producto;
    DELETE FROM producto_mascota WHERE codProducto = cod_producto;

    -- Insertar las nuevas relaciones en las tablas producto_edad y producto_mascota
    SET @i = 0;
    WHILE @i < JSON_LENGTH(JSON_EXTRACT(productoJSON, '$.codEdades')) DO
        INSERT INTO producto_edad (codProducto, codEdad) VALUES (cod_producto, JSON_EXTRACT(JSON_EXTRACT(productoJSON, '$.codEdades'), CONCAT('$[', @i, ']')));
        SET @i = @i + 1;
    END WHILE;

    SET @i = 0;
    WHILE @i < JSON_LENGTH(JSON_EXTRACT(productoJSON, '$.codMascotas')) DO
        INSERT INTO producto_mascota (codProducto, codMascota) VALUES (cod_producto, JSON_EXTRACT(JSON_EXTRACT(productoJSON, '$.codMascotas'), CONCAT('$[', @i, ']')));
        SET @i = @i + 1;
    END WHILE;
END // 

DELIMITER ;


