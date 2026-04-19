USE punto_vet;

DELIMITER //

CREATE PROCEDURE InsertarProducto(IN productoJSON JSON)
BEGIN 
    DECLARE nombre_producto VARCHAR(255);
    DECLARE cod_categoria INT;
    DECLARE codMascotas JSON;
    DECLARE codEdades JSON;
    DECLARE i INT DEFAULT 0;
    DECLARE mascota_id INT;
    DECLARE edad_id INT;
    
    -- Obtener el nombre y la categoría del JSON
    SET nombre_producto = JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.nombre'));
    SET cod_categoria = JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.codCategoria'));
    SET codMascotas = JSON_EXTRACT(productoJSON, '$.codMascotas');
    SET codEdades = JSON_EXTRACT(productoJSON, '$.codEdades');
    
    -- Verificar si el nombre y la categoría son nulos o vacíos
    IF nombre_producto IS NULL OR nombre_producto = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre del producto es obligatorio';
    END IF;
    
    IF cod_categoria IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El código de categoría del producto es obligatorio';
    END IF;

    -- Insertar el producto con los valores proporcionados
    INSERT INTO producto(codCategoria, codTamanio, nombre, descripcion, peso, mililitro, cantidad, stock, precioContado, precioLista, precioSuelto)
    VALUES (
        cod_categoria,
        IF(JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.codTamanio')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.codTamanio'))),
        nombre_producto,
        JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.descripcion')),
        IF(JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.peso')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.peso'))),
        IF(JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.mililitro')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.mililitro'))),
        IF(JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.cantidad')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.cantidad'))),
        IF(JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.stock')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.stock'))),
        IF(JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.precioContado')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.precioContado'))),
        IF(JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.precioLista')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.precioLista'))),
        IF(JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.precioSuelto')) = '', NULL, JSON_UNQUOTE(JSON_EXTRACT(productoJSON, '$.precioSuelto')))
    );
    
    -- Obtener el ID del producto recién insertado
    SET @producto_id = LAST_INSERT_ID();
    
    -- Procesar el array de mascotas
    WHILE i < JSON_LENGTH(codMascotas) DO
        SET mascota_id = JSON_UNQUOTE(JSON_EXTRACT(codMascotas, CONCAT('$[', i, ']')));
        INSERT INTO producto_mascota(codProducto, codMascota) VALUES (@producto_id, mascota_id);
        SET i = i + 1;
    END WHILE;
    
    SET i = 0;
    
    -- Procesar el array de edades
    WHILE i < JSON_LENGTH(codEdades) DO
        SET edad_id = JSON_UNQUOTE(JSON_EXTRACT(codEdades, CONCAT('$[', i, ']')));
        INSERT INTO producto_edad(codProducto, codEdad) VALUES (@producto_id, edad_id);
        SET i = i + 1;
    END WHILE;
    
END //

DELIMITER ;





call BuscarProductos("nueva prueba");