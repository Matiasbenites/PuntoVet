DELIMITER //

CREATE PROCEDURE ModificarUsuario(IN usuarioJSON JSON)
BEGIN 
    DECLARE userCount INT;

    SET @codUsuario = JSON_UNQUOTE(JSON_EXTRACT(usuarioJSON, '$.codUsuario'));
    SET @nombreApellido = JSON_UNQUOTE(JSON_EXTRACT(usuarioJSON, '$.nombreApellido'));
    SET @celular = JSON_UNQUOTE(JSON_EXTRACT(usuarioJSON, '$.celular'));
    SET @estado = JSON_UNQUOTE(JSON_EXTRACT(usuarioJSON, '$.estado'));
    SET @codTipoUsuario = JSON_UNQUOTE(JSON_EXTRACT(usuarioJSON, '$.codTipoUsuario'));
    SET @user = JSON_UNQUOTE(JSON_EXTRACT(usuarioJSON, '$.user'));

    SELECT COUNT(*) INTO userCount FROM usuario WHERE codUsuario = @codUsuario;

    IF userCount = 0 THEN
        -- Si el usuario no existe, generar un error
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario no existe';
    ELSE
        -- Si el usuario existe, realizar la actualización
        UPDATE usuario
        SET nombreApellido = @nombreApellido,
            celular = @celular,
            estado = @estado,
            codTipoUsuario = @codTipoUsuario,
            user = @user
        WHERE codUsuario = @codUsuario;
    END IF;
END //

DELIMITER ;
