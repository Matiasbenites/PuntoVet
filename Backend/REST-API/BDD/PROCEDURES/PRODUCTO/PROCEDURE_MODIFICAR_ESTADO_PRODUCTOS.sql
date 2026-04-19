DELIMITER //
CREATE PROCEDURE ModificarEstadoProducto(IN param INT)
BEGIN
    UPDATE producto
    SET estado = NOT estado
    WHERE codProducto = param;
END // 
DELIMITER ;

