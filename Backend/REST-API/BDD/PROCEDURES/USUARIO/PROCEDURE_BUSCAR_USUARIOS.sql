DELIMITER //

CREATE PROCEDURE BuscarUsuario(IN param VARCHAR(255))
BEGIN
    SELECT codUsuario, nombreApellido, celular, estado, codTipoUsuario, user
    FROM usuario
    WHERE (codUsuario = param OR nombreApellido LIKE CONCAT('%', param, '%') OR celular LIKE CONCAT('%', param, '%') 
			OR codTipoUsuario = param OR user LIKE CONCAT('%', param, '%') OR param IS NULL OR param = '');
END //

DELIMITER ;
