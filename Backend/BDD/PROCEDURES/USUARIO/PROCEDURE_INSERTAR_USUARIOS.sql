DELIMITER //

CREATE PROCEDURE InsertarUsuario(IN usuarioJSON TEXT)
BEGIN 
    
    DECLARE user_count INT;
    DECLARE v_nombreApellido VARCHAR(100);
    DECLARE v_celular VARCHAR(100);
    DECLARE v_password VARCHAR(60);
    DECLARE v_codTipoUsuario INT;
    DECLARE v_user VARCHAR(100);

    SET v_nombreApellido = JSON_UNQUOTE(JSON_EXTRACT(usuarioJSON, '$.nombreApellido'));
    SET v_celular = JSON_UNQUOTE(JSON_EXTRACT(usuarioJSON, '$.celular'));
    SET v_password = JSON_UNQUOTE(JSON_EXTRACT(usuarioJSON, '$.password'));
    SET v_codTipoUsuario = JSON_UNQUOTE(JSON_EXTRACT(usuarioJSON, '$.codTipoUsuario'));
    SET v_user = JSON_UNQUOTE(JSON_EXTRACT(usuarioJSON, '$.user'));
    SELECT COUNT(*) INTO user_count FROM usuario WHERE user = v_user;
    IF user_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El usuario ya existe.';
    ELSE
        INSERT INTO usuario (nombreApellido, celular, password, codTipoUsuario, user)
        VALUES (v_nombreApellido, v_celular, v_password, v_codTipoUsuario, v_user);
    END IF;
END //

DELIMITER ;

