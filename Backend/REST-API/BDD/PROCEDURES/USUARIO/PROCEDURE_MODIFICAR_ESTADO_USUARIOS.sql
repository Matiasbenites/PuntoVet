DELIMITER //
CREATE PROCEDURE ModificarEstadoUsuario(IN param INT)
BEGIN
    UPDATE usuario 
    SET estado = NOT estado
    WHERE codUsuario = param;
END // 
DELIMITER ;
