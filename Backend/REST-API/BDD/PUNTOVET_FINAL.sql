-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-06-2026 a las 18:07:58
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `puntovet`
--
CREATE DATABASE IF NOT EXISTS `puntovet` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `puntovet`;

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `BuscarProductos`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `BuscarProductos` (IN `param` VARCHAR(255), IN `limite` INT, IN `offset` INT, IN `v_estado` BINARY)   BEGIN
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
END$$

DROP PROCEDURE IF EXISTS `BuscarUsuario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `BuscarUsuario` (IN `param` VARCHAR(255))   BEGIN
    SELECT codUsuario, nombreApellido, celular, estado, codTipoUsuario, user
    FROM usuario
    WHERE (codUsuario = param OR nombreApellido LIKE CONCAT('%', param, '%') OR celular LIKE CONCAT('%', param, '%') 
			OR codTipoUsuario = param OR user LIKE CONCAT('%', param, '%') OR param IS NULL OR param = '');
END$$

DROP PROCEDURE IF EXISTS `InsertarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarProducto` (IN `productoJSON` JSON)   BEGIN 
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
    
END$$

DROP PROCEDURE IF EXISTS `InsertarUsuario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarUsuario` (IN `usuarioJSON` TEXT)   BEGIN 
    
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
END$$

DROP PROCEDURE IF EXISTS `ModificarEstadoProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ModificarEstadoProducto` (IN `param` INT)   BEGIN
    UPDATE producto
    SET estado = NOT estado
    WHERE codProducto = param;
END$$

DROP PROCEDURE IF EXISTS `ModificarEstadoUsuario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ModificarEstadoUsuario` (IN `param` INT)   BEGIN
    UPDATE usuario 
    SET estado = NOT estado
    WHERE codUsuario = param;
END$$

DROP PROCEDURE IF EXISTS `ModificarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ModificarProducto` (IN `productoJSON` JSON)   BEGIN 
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
END$$

DROP PROCEDURE IF EXISTS `ModificarUsuario`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ModificarUsuario` (IN `usuarioJSON` JSON)   BEGIN 
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
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

DROP TABLE IF EXISTS `categoria`;
CREATE TABLE `categoria` (
  `codCategoria` int(11) NOT NULL,
  `nombreCategoria` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `categoria`
--

TRUNCATE TABLE `categoria`;
--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`codCategoria`, `nombreCategoria`) VALUES
(1, 'Alimento'),
(2, 'Juguete'),
(3, 'Medicamento'),
(4, 'Accesorio'),
(5, 'Otro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

DROP TABLE IF EXISTS `compra`;
CREATE TABLE `compra` (
  `codCompra` int(11) NOT NULL,
  `codUsuario` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `montoTotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `compra`
--

TRUNCATE TABLE `compra`;
--
-- Volcado de datos para la tabla `compra`
--

INSERT INTO `compra` (`codCompra`, `codUsuario`, `fecha`, `montoTotal`) VALUES
(8, 1, '2026-06-04', 1000.00),
(9, 1, '2026-06-04', 1000.00),
(15, 1, '2026-06-09', 15000.00),
(16, 1, '2026-06-09', 300000.00),
(17, 1, '2026-06-09', 35000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra_detalle`
--

DROP TABLE IF EXISTS `compra_detalle`;
CREATE TABLE `compra_detalle` (
  `codCompraDetalle` int(11) NOT NULL,
  `codCompra` int(11) NOT NULL,
  `codProducto` int(11) DEFAULT NULL,
  `precioCompra` decimal(10,2) NOT NULL,
  `precioSuelto` decimal(10,2) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `subTotal` decimal(10,2) NOT NULL,
  `precioVenta` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `compra_detalle`
--

TRUNCATE TABLE `compra_detalle`;
--
-- Volcado de datos para la tabla `compra_detalle`
--

INSERT INTO `compra_detalle` (`codCompraDetalle`, `codCompra`, `codProducto`, `precioCompra`, `precioSuelto`, `cantidad`, `subTotal`, `precioVenta`) VALUES
(1, 8, 1, 1000.00, NULL, 1, 1000.00, NULL),
(2, 9, 1, 1000.00, NULL, 1, 1000.00, NULL),
(3, 15, 1, 15000.00, 1000.00, 1, 15000.00, NULL),
(4, 16, 1, 15000.00, 1000.00, 20, 300000.00, NULL),
(5, 17, 1, 17500.00, 1166.67, 2, 35000.00, 175000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `edad`
--

DROP TABLE IF EXISTS `edad`;
CREATE TABLE `edad` (
  `codEdad` int(11) NOT NULL,
  `nombreEdad` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `edad`
--

TRUNCATE TABLE `edad`;
--
-- Volcado de datos para la tabla `edad`
--

INSERT INTO `edad` (`codEdad`, `nombreEdad`) VALUES
(1, 'Cachorro'),
(2, 'Castrado'),
(3, 'Joven'),
(4, 'Adulto'),
(5, 'Mayor'),
(6, 'Urinario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota`
--

DROP TABLE IF EXISTS `mascota`;
CREATE TABLE `mascota` (
  `codMascota` int(11) NOT NULL,
  `nombreMascota` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `mascota`
--

TRUNCATE TABLE `mascota`;
--
-- Volcado de datos para la tabla `mascota`
--

INSERT INTO `mascota` (`codMascota`, `nombreMascota`) VALUES
(1, 'Perro'),
(2, 'Gato'),
(3, 'Ave'),
(4, 'Otro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

DROP TABLE IF EXISTS `producto`;
CREATE TABLE `producto` (
  `codProducto` int(11) NOT NULL,
  `codCategoria` int(11) NOT NULL,
  `codTamanio` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(300) DEFAULT NULL,
  `peso` double(5,2) DEFAULT NULL,
  `mililitro` int(11) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `imagen` varchar(200) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `precioSuelto` decimal(10,2) DEFAULT NULL,
  `precioVenta` decimal(10,2) DEFAULT NULL,
  `precioCompra` decimal(10,2) DEFAULT NULL,
  `pesoTotal` double(7,3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `producto`
--

TRUNCATE TABLE `producto`;
--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`codProducto`, `codCategoria`, `codTamanio`, `nombre`, `descripcion`, `peso`, `mililitro`, `estado`, `imagen`, `stock`, `precioSuelto`, `precioVenta`, `precioCompra`, `pesoTotal`) VALUES
(1, 1, 2, 'Pedigree p/perro cachorro', 'Alimento balanceado', 21.00, NULL, 1, 'undefined/file-1780976642434.png', 50, 1166.67, 175000.00, 17500.00, 1050.000),
(2, 1, NULL, 'Pedigree p/perro adulto', 'Alimento balanceado', 15.00, NULL, 1, NULL, 20, 1750.00, NULL, NULL, NULL),
(3, 1, NULL, 'Whiskas p/gatos castrados', 'Alimento balanceado', 10.00, NULL, 1, NULL, 20, 2470.00, NULL, NULL, NULL),
(4, 1, NULL, 'Sabrositos p/gatos mix', 'Alimento balanceado', 20.00, NULL, 1, NULL, 20, 1230.00, NULL, NULL, NULL),
(5, 1, NULL, 'Sabrositos p/perro adulto', 'Alimento balanceado', 15.00, NULL, 1, NULL, 20, 800.00, NULL, NULL, NULL),
(6, 1, NULL, 'Whiskas Buenos por naturaleza', 'Alimento balanceado', 10.00, NULL, 1, NULL, 20, 2230.00, NULL, NULL, NULL),
(7, 1, NULL, 'Dog Selection Etiqueta negra p/cachorro', 'Alimento balanceado', 15.00, NULL, 1, NULL, 21, 207.20, NULL, 2220.00, 15.000),
(8, 1, NULL, 'Dog Selection Etiqueta Negra p/adulto', 'Alimento balanceado', 21.00, NULL, 1, NULL, 23, 103.33, NULL, 1550.00, 63.000),
(9, 1, NULL, 'Tiernitos p/cachorro', 'Alimento balanceado', 15.00, NULL, 1, NULL, 20, 750.00, NULL, NULL, NULL),
(10, 1, NULL, 'Tiernitos p/gato', 'Alimento balanceado', 10.00, NULL, 1, NULL, 20, 1350.00, NULL, NULL, NULL),
(11, 1, NULL, 'Raza p/perro adulto Carne', 'Alimento balanceado', 21.00, NULL, 1, NULL, 20, 910.00, NULL, NULL, NULL),
(12, 1, NULL, 'Raza p/gato cachorro pescado', 'Alimento balanceado', 10.00, NULL, 1, NULL, 20, 1300.00, NULL, NULL, NULL),
(13, 1, NULL, 'Raza p/gato adulto leche y pollo', 'Alimento balanceado', 10.00, NULL, 1, NULL, 20, 1300.00, NULL, NULL, NULL),
(14, 1, NULL, 'Pro Plan Puppy p/perro Raza pequeÃ±a', 'Alimento balanceado', 7.50, NULL, 1, NULL, 22, 186.67, NULL, 1000.00, 15.000),
(15, 1, NULL, 'Pro Plan Puppy p/perro Raza mediana', 'Alimento balanceado', 15.00, NULL, 1, NULL, 20, 4300.00, NULL, NULL, NULL),
(16, 1, NULL, 'Pro Plan Gato p/gato adulto', 'Alimento balanceado', 15.00, NULL, 1, NULL, 20, 6250.00, NULL, NULL, NULL),
(17, 1, NULL, 'Dog Selection Etiqueta Negra Cachorro', 'Alimento balanceado', 10.00, NULL, 1, NULL, 20, 10.00, NULL, NULL, NULL),
(18, 1, NULL, 'Dogui p/Cachorro', 'Alimento balanceado', 15.00, NULL, 1, NULL, 20, 1400.00, NULL, NULL, NULL),
(19, 1, NULL, 'Dogui p/Adulto', 'Alimento balanceado', 15.00, NULL, 1, NULL, 20, 1300.00, NULL, NULL, NULL),
(20, 1, NULL, 'Gati p/Gato Carne y Pollo', 'Alimento balanceado', 15.00, NULL, 1, NULL, 20, 1700.00, NULL, NULL, NULL),
(21, 1, NULL, 'Sieger Puppy p/Cachorro medium', 'Alimento balanceado', 15.00, NULL, 1, NULL, 20, 2500.00, NULL, NULL, NULL),
(22, 1, NULL, 'Sieger Senior p/Adulto reduced calorie', 'Alimento balanceado', 12.00, NULL, 1, NULL, 20, 2700.00, NULL, NULL, NULL),
(23, 1, NULL, 'Sieger Katze p/Gato Stress Control', 'Alimento balanceado', 7.50, NULL, 1, NULL, 20, 3800.00, NULL, NULL, NULL),
(24, 1, NULL, 'Pedigree p/perro senior', 'Alimento balanceado', 8.00, NULL, 1, NULL, 20, 1600.00, NULL, NULL, NULL),
(25, 1, NULL, 'Agility p/perro adulto', 'Alimento balanceado', 20.00, NULL, 1, NULL, 20, 1400.00, NULL, NULL, NULL),
(26, 1, NULL, 'Agility p/perro cachorro', 'Alimento balanceado', 10.00, NULL, 1, NULL, 20, 1560.00, NULL, NULL, NULL),
(27, 1, NULL, 'Agility cats kitten', 'Alimento balanceado', 10.00, NULL, 1, NULL, 20, 2430.00, NULL, NULL, NULL),
(28, 1, NULL, 'Agility cats adulto', 'Alimento balanceado', 10.00, NULL, 1, NULL, 20, 2400.00, NULL, NULL, NULL),
(29, 1, NULL, 'Maxxium p/perro cachorro', 'Alimento balanceado', 20.00, NULL, 1, NULL, 20, 1400.00, NULL, NULL, NULL),
(30, 1, NULL, 'Maxxium p/perro adulto', 'Alimento balanceado', 20.00, NULL, 1, NULL, 20, 1870.00, NULL, NULL, NULL),
(31, 1, NULL, 'Maxxium p/perro adulto sabor cordero', 'Alimento balanceado', 15.00, NULL, 1, NULL, 20, 1750.00, NULL, NULL, NULL),
(32, 1, NULL, 'Vital can premium p/perro cachorro', 'Alimento balanceado', 20.00, NULL, 1, NULL, 20, 1100.00, NULL, NULL, NULL),
(33, 1, NULL, 'Vital can premium p/perro adulto', 'Alimento balanceado', 20.00, NULL, 1, NULL, 20, 1300.00, NULL, NULL, NULL),
(34, 1, NULL, 'Belcan p/perro adulto Safety pack', 'Alimento balanceado', 24.00, NULL, 1, NULL, 20, 500.00, NULL, NULL, NULL),
(35, 1, NULL, 'Belcan p/perro junior', 'Alimento balanceado', 15.00, NULL, 1, NULL, 20, 750.00, NULL, NULL, NULL),
(36, 1, NULL, 'Belcat p/gato', 'Alimento balanceado', 10.00, NULL, 1, NULL, 20, 750.00, NULL, NULL, NULL),
(37, 1, NULL, 'Therapy canine cardiac health', 'Alimento balanceado', 10.00, NULL, 1, NULL, 20, 5000.00, NULL, NULL, NULL),
(38, 1, NULL, 'Therapy canine gastrointestinal', 'Alimento balanceado', 10.00, NULL, 1, NULL, 20, 8000.00, NULL, NULL, NULL),
(39, 1, NULL, 'Therapy feline gastrointestinal', 'Alimento balanceado', 2.00, NULL, 1, NULL, 20, 6250.00, NULL, NULL, NULL),
(40, 1, NULL, 'Therapy feline urinary health', 'Alimento balanceado', 7.50, NULL, 1, NULL, 20, 6500.00, NULL, NULL, NULL),
(41, 1, NULL, 'Balanced kitten', 'Alimento balanceado', 7.50, NULL, 1, NULL, 20, 4600.00, NULL, NULL, NULL),
(42, 1, NULL, 'Balanced p/gato adulto', 'Alimento balanceado', 7.50, NULL, 1, NULL, 20, 4250.00, NULL, NULL, NULL),
(43, 1, NULL, 'Balanced Puppy razas grandes (p/perro)', 'Alimento balanceado', 20.00, NULL, 1, NULL, 20, 2800.00, NULL, NULL, NULL),
(44, 1, NULL, 'Balanced Adultos razas medianas (p/perro)', 'Alimento balanceado', 20.00, NULL, 1, NULL, 20, 2500.00, NULL, NULL, NULL),
(45, 1, NULL, 'Nutrique large puppy (p/perro cachorro)', 'Alimento balanceado', 15.00, NULL, 1, NULL, 20, 4230.00, NULL, NULL, NULL),
(46, 1, NULL, 'Nutrique skin sensitivity dog', 'Alimento balanceado', 15.00, NULL, 1, NULL, 20, 3990.00, NULL, NULL, NULL),
(47, 1, NULL, 'PEDIGREE CACHORRO x3Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 10, 11666.00, NULL, NULL, NULL),
(48, 1, NULL, 'PEDIGREE CACHORRO x8Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 15, 5600.00, NULL, NULL, NULL),
(49, 1, NULL, 'PEDIGREE CACHORRO x21Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, 20, 2866.00, NULL, NULL, NULL),
(50, 1, NULL, 'PEDIGREE ADULTO x3Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 12, 11200.00, NULL, NULL, NULL),
(51, 1, NULL, 'PEDIGREE ADULTO X8Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 18, 5600.00, NULL, NULL, NULL),
(52, 1, NULL, 'PEDIGREE ADULTO x15Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 3546.00, NULL, NULL, NULL),
(53, 1, NULL, 'PEDIGREE ADULTO x21Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, 30, 3000.00, NULL, NULL, NULL),
(54, 1, NULL, 'PEDIGREE RAZAS PEQUEÑAS x3Kg', 'Alimento balanceado para perros de razas pequeñas PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 8, 11666.00, NULL, NULL, NULL),
(55, 1, NULL, 'PEDIGREE RAZAS PEQUEÑAS x8Kg', 'Alimento balanceado para perros de razas pequeñas PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 12, 5600.00, NULL, NULL, NULL),
(56, 1, NULL, 'PEDIGREE RAZAS PEQUEÑAS x15Kg', 'Alimento balanceado para perros de razas pequeñas PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 18, 3546.00, NULL, NULL, NULL),
(57, 1, NULL, 'PEDIGREE SENIOR x3Kg.', 'Alimento balanceado para perros adultos mayores PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 10, 11200.00, NULL, NULL, NULL),
(58, 1, NULL, 'PEDIGREE SENIOR x8Kg.', 'Alimento balanceado para perros adultos mayores PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 15, 5600.00, NULL, NULL, NULL),
(59, 1, NULL, 'SOBRESITOS PEDIGREE x12U', 'Alimento balanceado en sobres PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, 20, 2916.00, NULL, NULL, NULL),
(60, 1, NULL, 'SOBRESITOS PEDIGREE xUnidad', 'Alimento balanceado en sobres PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 5, 2916.00, NULL, NULL, NULL),
(61, 1, NULL, 'LATAS PEDIGREE', 'Alimento balanceado en latas PET FRIEND / PuntoVet', NULL, NULL, 1, NULL, 30, NULL, NULL, NULL, NULL),
(62, 1, NULL, 'PED. DENTASTIX RAZAS PEQUEÑAS x1UNI', 'Snack dental para perros de razas pequeñas PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 25, 21000.00, NULL, NULL, NULL),
(63, 1, NULL, 'PED. DENTASTIX RAZAS PEQUEÑAS x3UNI', 'Snack dental para perros de razas pequeñas PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 15, 10266.00, NULL, NULL, NULL),
(64, 1, NULL, 'PED. DENTASTIX RAZAS PEQUEÑAS x7UNI', 'Snack dental para perros de razas pequeñas PET FRIEND / PuntoVet', 7.00, NULL, 1, NULL, 10, 7000.00, NULL, NULL, NULL),
(65, 1, NULL, 'PED. DENTASTIX RAZAS MEDIANAS X1UNI.', 'Snack dental para perros de razas medianas PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 20, 21000.00, NULL, NULL, NULL),
(66, 1, NULL, 'PED. DENTASTIX RAZAS MEDIANAS x3UNI.', 'Snack dental para perros de razas medianas PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 25, 10266.00, NULL, NULL, NULL),
(67, 1, NULL, 'PED. DENTASTIX RAZAS MEDIANAS x7UNI.', 'Snack dental para perros de razas medianas PET FRIEND / PuntoVet', 7.00, NULL, 1, NULL, 10, 7000.00, NULL, NULL, NULL),
(68, 1, NULL, 'PED. DENTASTIX RAZAS GRANDES X1UNI.', 'Snack dental para perros de razas grandes PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 15, 21000.00, NULL, NULL, NULL),
(69, 1, NULL, 'PED. DENTASTIX RAZAS GRANDES x3UNI.', 'Snack dental para perros de razas grandes PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 20, 10266.00, NULL, NULL, NULL),
(70, 1, NULL, 'PED. DENTASTIX RAZAS GRANDES x7UNI.', 'Snack dental para perros de razas grandes PET FRIEND / PuntoVet', 7.00, NULL, 1, NULL, 8, 7000.00, NULL, NULL, NULL),
(71, 1, NULL, 'PEDIGREE RODEO x4UNI.', 'Snack para perros PET FRIEND / PuntoVet', 4.00, NULL, 1, NULL, 25, 6300.00, NULL, NULL, NULL),
(72, 1, NULL, 'PEDIGREE BISCROK x100gr.', 'Galletas para perros PET FRIEND / PuntoVet', 100.00, NULL, 1, NULL, 30, 210.00, NULL, NULL, NULL),
(73, 1, NULL, 'PEDIGREE BISCROK x500gr.', 'Galletas para perros PET FRIEND / PuntoVet', 500.00, NULL, 1, NULL, 20, 84.00, NULL, NULL, NULL),
(74, 1, NULL, 'WHISKAS x3Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 15, 11200.00, NULL, NULL, NULL),
(75, 1, NULL, 'WHISKAS x10Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 20, 4900.00, NULL, NULL, NULL),
(76, 1, NULL, 'WHISKAS GATOS CASTRADOS x3Kg.', 'Alimento balanceado para gatos esterilizados PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 15, 11200.00, NULL, NULL, NULL),
(77, 1, NULL, 'WHISKAS GATOS CASTRADOS x10Kg.', 'Alimento balanceado para gatos esterilizados PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 25, 4900.00, NULL, NULL, NULL),
(78, 1, NULL, 'WHISKAS BUENOS POR NATURALEZA x3Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 20, 11200.00, NULL, NULL, NULL),
(79, 1, NULL, 'WHISKAS BUENOS POR NATURALEZA x10Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 30, 4900.00, NULL, NULL, NULL),
(80, 1, NULL, 'SOBRESITOS WHISKAS x12UNI.', 'Alimento balanceado en sobres PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, 15, 2916.00, NULL, NULL, NULL),
(81, 1, NULL, 'SOBESITOS WHISKAS xUNI.', 'Alimento balanceado en sobres PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 10, 2916.00, NULL, NULL, NULL),
(82, 1, NULL, 'LATAS WHISKAS', 'Alimento balanceado en latas PET FRIEND / PuntoVet', NULL, NULL, 1, NULL, 30, NULL, NULL, NULL, NULL),
(83, 1, NULL, 'SABROSITOS MIX x20Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 20, 2940.00, NULL, NULL, NULL),
(84, 1, NULL, 'SABROSITOS MIX x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 3266.00, NULL, NULL, NULL),
(85, 1, NULL, 'SABROSITOS MIX x8Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 30, 4200.00, NULL, NULL, NULL),
(86, 1, NULL, 'SABROSITOS CACHORRO x18Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 18.00, NULL, 1, NULL, 15, 3344.00, NULL, NULL, NULL),
(87, 1, NULL, 'SABROSITOS CACHORRO x8Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 20, 5600.00, NULL, NULL, NULL),
(88, 1, NULL, 'SABROSITOS GATO MIX x20Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 25, 3080.00, NULL, NULL, NULL),
(89, 1, NULL, 'SABROSITOS GATO MIX x10Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 30, 4480.00, NULL, NULL, NULL),
(90, 1, NULL, 'SABROSITOS GATO PESCADO x20Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 20, 3080.00, NULL, NULL, NULL),
(91, 1, NULL, 'SABROSITOS GATO PESCADO x10Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 25, 4480.00, NULL, NULL, NULL),
(92, 1, NULL, 'ESTAMPA PLUS CACHORRO x15Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 20, 4200.00, NULL, NULL, NULL),
(93, 1, NULL, 'ESTAMPA PLUS ADULTO x15Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 3733.00, NULL, NULL, NULL),
(94, 1, NULL, 'ESTAMPA PLUS ADULTO x20Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 30, 3360.00, NULL, NULL, NULL),
(95, 1, NULL, 'ESTAMPA PLUS ADULTO RAZAS PEQ. x8Kg.', 'Alimento balanceado para perros adultos de razas pequeñas PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 15, 5600.00, NULL, NULL, NULL),
(96, 1, NULL, 'ESTAMPA PLUS ADULTO RAZAS PEQ. x15Kg.', 'Alimento balanceado para perros adultos de razas pequeñas PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 20, 4200.00, NULL, NULL, NULL),
(97, 1, NULL, 'ESTAMPA PLUS GATO x15Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 3733.00, NULL, NULL, NULL),
(98, 1, NULL, 'ESTAMPA PLUS GATO x8Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 30, 5600.00, NULL, NULL, NULL),
(99, 1, NULL, 'ESTAMPA CRIADORES x20Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 20, 3080.00, NULL, NULL, NULL),
(100, 1, NULL, 'VAGONETA CACHORRO x15Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 3920.00, NULL, NULL, NULL),
(101, 1, NULL, 'VAGONETA GOURMET x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 20, 3733.00, NULL, NULL, NULL),
(102, 1, NULL, 'VAGONETA GOURMET x20Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 30, 3360.00, NULL, NULL, NULL),
(103, 1, NULL, 'VAGONETA MIX x8Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 15, 5600.00, NULL, NULL, NULL),
(104, 1, NULL, 'VAGONETA MIX x20Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 20, 3360.00, NULL, NULL, NULL),
(105, 1, NULL, 'VAGONETA GATITOS x10Kg,', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 25, 4900.00, NULL, NULL, NULL),
(106, 1, NULL, 'VAGONETA GATO x10Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 30, 4480.00, NULL, NULL, NULL),
(107, 1, NULL, 'VAGONETA GATO x20Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 20, 3080.00, NULL, NULL, NULL),
(108, 1, NULL, 'DR. PERROT x20Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 15, 2240.00, NULL, NULL, NULL),
(109, 1, NULL, 'DOG SELECTION ETIQUETA NEGRA ADULTO x15Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 18, 1427.00, NULL, NULL, NULL),
(110, 1, NULL, 'DOG SELECTION ETIQUETA NEGRA ADULTO x21Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, 25, 1350.00, NULL, NULL, NULL),
(111, 1, NULL, 'DOG SELECTION ETIQUETA NEGRA CACHORRO x15Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 27, 1381.00, NULL, NULL, NULL),
(112, 1, NULL, 'DOG SELECTION ETIQUETA NEGRA RAZAS PEQ. x15Kg.', 'Alimento balanceado para perros de razas pequeñas PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 28, 1274.00, NULL, NULL, NULL),
(113, 1, NULL, 'DOG SELECTION CRIAD. CACHORRO x8Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 5, 997.00, NULL, NULL, NULL),
(114, 1, NULL, 'DOG SELECTION CRIAD. CACHORRO x21Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, 22, 910.00, NULL, NULL, NULL),
(115, 1, NULL, 'DOG SELECTION CRIAD. ADULTO x15Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 29, 839.00, NULL, NULL, NULL),
(116, 1, NULL, 'DOG SELECTION CRIAD. ADULTO x21Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, 21, 800.00, NULL, NULL, NULL),
(117, 1, NULL, 'DOG SELECTION CRIAD. RAZAS P. x15Kg.', 'Alimento balanceado para perros adultos de razas pequeñas PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 26, 839.00, NULL, NULL, NULL),
(118, 1, NULL, 'PACHA PERRO MIX 10Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 30, 499.00, NULL, NULL, NULL),
(119, 1, NULL, 'PACHA PERRO MIX 15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 29, 485.00, NULL, NULL, NULL),
(120, 1, NULL, 'PACHA PERRO MIX 22Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 22.00, NULL, 1, NULL, 30, 470.00, NULL, NULL, NULL),
(121, 1, NULL, 'TIERNITOS CACHORRO x15Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 30, 719.00, NULL, NULL, NULL),
(122, 1, NULL, 'TIERNITOS CACHORRO x21Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, 26, 661.00, NULL, NULL, NULL),
(123, 1, NULL, 'TIERNITOS CACHORRO x8Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 29, 744.00, NULL, NULL, NULL),
(124, 1, NULL, 'TIERNITOS ADULTO x8Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 12, 739.00, NULL, NULL, NULL),
(125, 1, NULL, 'TIERNITOS ADULTO x15Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 27, 645.00, NULL, NULL, NULL),
(126, 1, NULL, 'TIERNITOS ADULTO x21Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, 25, 583.00, NULL, NULL, NULL),
(127, 1, NULL, 'TIERNITOS GATOS x10Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 18, 1014.00, NULL, NULL, NULL),
(128, 1, NULL, 'NUTRIPET', 'Alimento balanceado para mascotas PET FRIEND / PuntoVet', NULL, NULL, 1, NULL, 26, NULL, NULL, NULL, NULL),
(129, 1, NULL, 'RAZA CACHORRO x15Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 16, 861.00, NULL, NULL, NULL),
(130, 1, NULL, 'RAZA PERRO CARNE x8Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 8, 741.00, NULL, NULL, NULL),
(131, 1, NULL, 'RAZA PERRO CARNE x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 17, 695.00, NULL, NULL, NULL),
(132, 1, NULL, 'RAZA PERRO CARNE x21Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, 21, 674.00, NULL, NULL, NULL),
(133, 1, NULL, 'RAZA PERRO RAZAS PEQUEÑAS x15Kg', 'Alimento balanceado para perros de razas pequeñas PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 23, 695.00, NULL, NULL, NULL),
(134, 1, NULL, 'RAZA EN CASA ADULTOS x3Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 27, 934.00, NULL, NULL, NULL),
(135, 1, NULL, 'RAZA EN CASA ADULTOS x8Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 19, 884.00, NULL, NULL, NULL),
(136, 1, NULL, 'RAZA EN CASA CACHORROS x1,5Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 18, 1261.00, NULL, NULL, NULL),
(137, 1, NULL, 'RAZA EN CASA CACHORROS x8Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 20, 1077.00, NULL, NULL, NULL),
(138, 1, NULL, 'RAZA GATO ADULTO POLLO Y LECHE x10Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 20, 1024.00, NULL, NULL, NULL),
(139, 1, NULL, 'RAZA GATO CARNE PESC. Y ARROZ x10Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 28, 1024.00, NULL, NULL, NULL),
(140, 1, NULL, 'RAZA GATO PESCADO x15Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 23, 974.00, NULL, NULL, NULL),
(141, 1, NULL, 'RAZA GATO PESCADO x10Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 20, 1024.00, NULL, NULL, NULL),
(142, 1, NULL, 'RAZA GATO PESCADO OMEGA 3y6 x10Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 24, 1157.00, NULL, NULL, NULL),
(143, 1, NULL, 'RAZA GATO CACHORRO CARNE Y LECHE x8Kg.', 'Alimento balanceado para gatos cachorros PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, 24, 1264.00, NULL, NULL, NULL),
(144, 1, NULL, 'PURINA', 'Alimento balanceado para mascotas PET FRIEND / PuntoVet', NULL, NULL, 1, NULL, 30, NULL, NULL, NULL, NULL),
(145, 1, NULL, 'PRO PLAN PUPPY RAZA PEQUEÑA x1Kg', 'Alimento balanceado para cachorros de razas pequeñas PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 28, 5188.00, NULL, NULL, NULL),
(146, 1, NULL, 'PRO PLAN PUPPY RAZA PEQUEÑA x3Kg', 'Alimento balanceado para cachorros de razas pequeñas PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 29, 4670.00, NULL, NULL, NULL),
(147, 1, NULL, 'PRO PLAN PUPPY RAZA PEQUEÑA x7,5Kg', 'Alimento balanceado para cachorros de razas pequeñas PET FRIEND / PuntoVet', 7.00, NULL, 1, NULL, 29, 3908.00, NULL, NULL, NULL),
(148, 1, NULL, 'PRO PLAN PUPPY RAZA MEDIANA x1Kg.', 'Alimento balanceado para cachorros de razas medianas PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 20, 4959.00, NULL, NULL, NULL),
(149, 1, NULL, 'PRO PLAN PUPPY RAZA MEDIANA x3Kg.', 'Alimento balanceado para cachorros de razas medianas PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 20, 4456.00, NULL, NULL, NULL),
(150, 1, NULL, 'PRO PLAN PUPPY RAZA MEDIANA x15Kg.', 'Alimento balanceado para cachorros de razas medianas PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 3077.00, NULL, NULL, NULL),
(151, 1, NULL, 'PRO PLAN PUPPY RAZA GRANDE x3Kg.', 'Alimento balanceado para cachorros de razas grandes PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 27, 4462.00, NULL, NULL, NULL),
(152, 1, NULL, 'PRO PLAN PUPPY RAZA GRANDE x15Kg.', 'Alimento balanceado para cachorros de razas grandes PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 3077.00, NULL, NULL, NULL),
(153, 1, NULL, 'PRO PLAN ADULTOS RAZAS PEQUEÑAS x1Kg', 'Alimento balanceado para perros adultos de razas pequeñas PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 29, 4717.00, NULL, NULL, NULL),
(154, 1, NULL, 'PRO PLAN ADULTOS RAZAS PEQUEÑAS x3Kg', 'Alimento balanceado para perros adultos de razas pequeñas PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 26, 4238.00, NULL, NULL, NULL),
(155, 1, NULL, 'PRO PLAN ADULTOS RAZAS PEQUEÑAS x7,5Kg', 'Alimento balanceado para perros adultos de razas pequeñas PET FRIEND / PuntoVet', 7.00, NULL, 1, NULL, 30, 3793.00, NULL, NULL, NULL),
(156, 1, NULL, 'PRO PLAN ADULTOS RAZAS MEDIANAS x3Kg.', 'Alimento balanceado para perros adultos de razas medianas PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 25, 4043.00, NULL, NULL, NULL),
(157, 1, NULL, 'PRO PLAN ADULTOS RAZAS MEDIANAS x15Kg.', 'Alimento balanceado para perros adultos de razas medianas PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 28, 2797.00, NULL, NULL, NULL),
(158, 1, NULL, 'PRO PLAN ADULTOS RAZAS GRANDES x3Kg.', 'Alimento balanceado para perros adultos de razas grandes PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 25, 4043.00, NULL, NULL, NULL),
(159, 1, NULL, 'PRO PLAN ADULTOS RAZAS GRANDES x15Kg.', 'Alimento balanceado para perros adultos de razas grandes PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 28, 2797.00, NULL, NULL, NULL),
(160, 1, NULL, 'PRO PLAN ACTIVE MIND RAZAS PEQ. (+7 años) 1Kg', 'Alimento balanceado para perros adultos mayores de razas pequeñas PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 27, 5302.00, NULL, NULL, NULL),
(161, 1, NULL, 'PRO PLAN ACTIVE MIND RAZAS PEQ. (+7 años) 3Kg', 'Alimento balanceado para perros adultos mayores de razas pequeñas PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 23, 4657.00, NULL, NULL, NULL),
(162, 1, NULL, 'PRO PLAN ACTIVE MIND RAZAS PEQ. (+7 años) 7,5Kg', 'Alimento balanceado para perros adultos mayores de razas pequeñas PET FRIEND / PuntoVet', 7.00, NULL, 1, NULL, 30, 3905.00, NULL, NULL, NULL),
(163, 1, NULL, 'PRO PLAN ACTIVE MIND RAZAS MED. Y GR. (+7 añoa) 3Kg', 'Alimento balanceado para perros adultos mayores de razas medianas y grandes PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 26, 4449.00, NULL, NULL, NULL),
(164, 1, NULL, 'PRO PLAN ACTIVE MIND RAZAS MED. Y GR. (+7 añoa) 15Kg', 'Alimento balanceado para perros adultos mayores de razas medianas y grandes PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 3083.00, NULL, NULL, NULL),
(165, 1, NULL, 'PRO PLAN KITTEN x1Kg.', 'Alimento balanceado para gatitos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 21, 7059.00, NULL, NULL, NULL),
(166, 1, NULL, 'PRO PLAN KITTEN x3Kg.', 'Alimento balanceado para gatitos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 25, 6373.00, NULL, NULL, NULL),
(167, 1, NULL, 'PRO PLAN KITTEN x7,5Kg.', 'Alimento balanceado para gatitos PET FRIEND / PuntoVet', 7.00, NULL, 1, NULL, 24, 5593.00, NULL, NULL, NULL),
(168, 1, NULL, 'PRO PLAN GATO ADULTO x1Kg.', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 26, 6463.00, NULL, NULL, NULL),
(169, 1, NULL, 'PRO PLAN GATO ADULTO x3Kg.', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 27, 5788.00, NULL, NULL, NULL),
(170, 1, NULL, 'PRO PLAN GATO ADULTO x7,5Kg.', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 7.00, NULL, 1, NULL, 28, 5402.00, NULL, NULL, NULL),
(171, 1, NULL, 'PRO PLAN GATO ADULTO x15Kg.', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 31, 4411.00, NULL, NULL, NULL),
(172, 1, NULL, 'PRO PLAN GATO URINARY x1Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 29, 7444.00, NULL, NULL, NULL),
(173, 1, NULL, 'PRO PLAN GATO URINARY x3Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 26, 6647.00, NULL, NULL, NULL),
(174, 1, NULL, 'PRO PLAN GATO URINARY x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.00, NULL, 1, NULL, 30, 5900.00, NULL, NULL, NULL),
(175, 1, NULL, 'PRO PLAN GATO URINARY x15Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 30, 4724.00, NULL, NULL, NULL),
(176, 1, NULL, 'EXCELLENT KITTEN x1Kg.', 'Alimento balanceado para gatitos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 23, 4687.00, NULL, NULL, NULL),
(177, 1, NULL, 'EXCELLENT KITTEN x7,5Kg.', 'Alimento balanceado para gatitos PET FRIEND / PuntoVet', 7.00, NULL, 1, NULL, 29, 3943.00, NULL, NULL, NULL),
(178, 1, NULL, 'EXCELLENT GATO ADULTO x3Kg.', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 30, 3856.00, NULL, NULL, NULL),
(179, 1, NULL, 'EXCELLENT GATO ADULTO x7,5Kg.', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 7.00, NULL, 1, NULL, 27, 3564.00, NULL, NULL, NULL),
(180, 1, NULL, 'EXCELLENT GATO ADULTO x15Kg.', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 28, 3206.00, NULL, NULL, NULL),
(181, 1, NULL, 'EXCELLENT URINARY x1Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 29, 4919.00, NULL, NULL, NULL),
(182, 1, NULL, 'EXCELLENT URINARY x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.00, NULL, 1, NULL, 28, 4103.00, NULL, NULL, NULL),
(183, 1, NULL, 'DOG CHOW CACHORROS MINI Y PEQ. x1,5Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 21, 2949.00, NULL, NULL, NULL),
(184, 1, NULL, 'DOG CHOW CACHORROS MINI Y PEQ. x3Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 20, 1788.00, NULL, NULL, NULL),
(185, 1, NULL, 'DOG CHOW CACHORROS MINI Y PEQ. x21Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, 22, 1488.00, NULL, NULL, NULL),
(186, 1, NULL, 'DOG CHOW CACHORROS MEDIANOS Y G. x1,5Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 26, 2845.00, NULL, NULL, NULL),
(187, 1, NULL, 'DOG CHOW CACHORROS MEDIANOS Y G. x3Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 24, 1725.00, NULL, NULL, NULL),
(188, 1, NULL, 'DOG CHOW CACHORROS MEDIANOS Y G. x15Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 30, 1506.00, NULL, NULL, NULL),
(189, 1, NULL, 'DOG CHOW CACHORROS MEDIANOS Y G, x21Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, 27, 1436.00, NULL, NULL, NULL),
(190, 1, NULL, 'DOG CHOW ADULTO MINI Y PEQ. x1,5Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 21, 3147.00, NULL, NULL, NULL),
(191, 1, NULL, 'DOG CHOW ADULTO MINI Y PEQ. x3Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 24, 1891.00, NULL, NULL, NULL),
(192, 1, NULL, 'DOG CHOW ADULTO MINI Y PEQ. x15Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 28, 1655.00, NULL, NULL, NULL),
(193, 1, NULL, 'DOG CHOW ADULTO MINI Y PEQ. x21Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, 25, 1571.00, NULL, NULL, NULL),
(194, 1, NULL, 'DOG CHOW ADULTO MEDIANOS Y GRANDES x1,5Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 30, 2884.00, NULL, NULL, NULL),
(195, 1, NULL, 'DOG CHOW ADULTO MEDIANOS Y GRANDES x3Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 28, 1741.00, NULL, NULL, NULL),
(196, 1, NULL, 'DOG CHOW ADULTO MEDIANOS Y GRANDES x15Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 29, 1528.00, NULL, NULL, NULL),
(197, 1, NULL, 'DOG CHOW ADULTO MEDIANOS Y GRANDES x21Kg.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, 29, 1463.00, NULL, NULL, NULL),
(198, 1, NULL, 'DOG CHOW LONGEVIDAD x3KG.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 9333.00, NULL, NULL, NULL),
(199, 1, NULL, 'DOG CHOW LONGEVIDAD x8Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, NULL, 7875.00, NULL, NULL, NULL),
(200, 1, NULL, 'DOG CHOW LONGEVIDAD x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(201, 1, NULL, 'DOG CHOW LONGEVIDAD x21Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, NULL, 6000.00, NULL, NULL, NULL),
(202, 1, NULL, 'CAT CHOW GATITOS x1Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, NULL, 22400.00, NULL, NULL, NULL),
(203, 1, NULL, 'CAT CHOW GATITOS x8Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, NULL, 7875.00, NULL, NULL, NULL),
(204, 1, NULL, 'CAT CHOW GATITOS x15Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(205, 1, NULL, 'CAT CHOW GATOS ADULTOS x1Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, NULL, 22400.00, NULL, NULL, NULL),
(206, 1, NULL, 'CAT CHOW GATOS AULTOS x3Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(207, 1, NULL, 'CAT CHOW GATOS ADULTOS x8Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, NULL, 7875.00, NULL, NULL, NULL),
(208, 1, NULL, 'CAT CHOW GATOS ADULTOS x15Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(209, 1, NULL, 'CAT CHOW ESTERILIZADOS x1Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, NULL, 22400.00, NULL, NULL, NULL),
(210, 1, NULL, 'CAT CHOW ESTERILIZADOS x3Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(211, 1, NULL, 'CAT CHOW ESTERILIZADOS x15Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(212, 1, NULL, 'GATI CARNE Y POLLO x3Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(213, 1, NULL, 'GATI CARNE Y POLLO x15Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(214, 1, NULL, 'GATI PESCADO Y SALMÒN x1Kg', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, NULL, 22400.00, NULL, NULL, NULL),
(215, 1, NULL, 'GATI PESCADO Y SALMÒN x3Kg', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(216, 1, NULL, 'GATI PESCADO Y SALMÒN x8Kg', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, NULL, 7875.00, NULL, NULL, NULL),
(217, 1, NULL, 'GATI PESCADO Y SALMÒN x15Kg', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(218, 1, NULL, 'DOGUI CACHORROS x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(219, 1, NULL, 'DOGUI CACHORROS x8Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, NULL, 7875.00, NULL, NULL, NULL),
(220, 1, NULL, 'DOGUI CACHORROS x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(221, 1, NULL, 'DOGUI CACHORROS x21Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, NULL, 6000.00, NULL, NULL, NULL),
(222, 1, NULL, 'DOGUI ADULTOS x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(223, 1, NULL, 'DOGUI ADULTOS x8Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 8.00, NULL, 1, NULL, NULL, 7875.00, NULL, NULL, NULL),
(224, 1, NULL, 'DOGUI ADULTOS x15Kg,', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(225, 1, NULL, 'DOGUI ADULTOS x21Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 21.00, NULL, 1, NULL, NULL, 6000.00, NULL, NULL, NULL),
(226, 1, NULL, 'VITAL CAN', 'Alimento balanceado para mascotas PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, NULL, 22400.00, NULL, NULL, NULL),
(227, 1, NULL, 'BALANCED PUPPY RAZAS PEQUEÑAS x3Kg', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(228, 1, NULL, 'BALANCED PUPPY RAZAS PEQUEÑAS x7,5Kg', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 8400.00, NULL, NULL, NULL),
(229, 1, NULL, 'BALANCED PUPPY RAZAS MEDIANAS x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(230, 1, NULL, 'BALANCED PUPPY RAZAS MEDIANAS x12Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, NULL, 8167.00, NULL, NULL, NULL),
(231, 1, NULL, 'BALANCED PUPPY RAZAS MEDIANAS x20Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, NULL, 6300.00, NULL, NULL, NULL),
(232, 1, NULL, 'BALANCED PUPPY RAZAS GRANDES x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(233, 1, NULL, 'BALANCED PUPPY RAZAS GRANDES x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(234, 1, NULL, 'BALANCED PUPPY RAZAS GRANDES x20Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, NULL, 6300.00, NULL, NULL, NULL),
(235, 1, NULL, 'BALANCED ADULTOS RAZAS PEQUEÑAS x3Kg', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(236, 1, NULL, 'BALANCED ADULTOS RAZAS PEQUEÑAS x7,5Kg', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 8400.00, NULL, NULL, NULL),
(237, 1, NULL, 'BALANCED ADULTOS RAZAS PEQUEÑAS x15Kg', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(238, 1, NULL, 'BALANCED ADULTOS RAZAS MEDIANAS x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(239, 1, NULL, 'BALANCED ADULTOS RAZAS MEDIANAS x12Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, NULL, 8167.00, NULL, NULL, NULL),
(240, 1, NULL, 'BALANCED ADULTOS RAZAS MEDIANAS x20Kg,', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, NULL, 6300.00, NULL, NULL, NULL),
(241, 1, NULL, 'BALANCED ADULTOS RAZAS GRANDES x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(242, 1, NULL, 'BALANCED ADULTOS RAZAS GRANDES x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(243, 1, NULL, 'BALANCED ADULTOS RAZAS GRANDES x20Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, NULL, 6300.00, NULL, NULL, NULL),
(244, 1, NULL, 'BALANCED ADULTOS RAZAS GIGANTES x20Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, NULL, 6300.00, NULL, NULL, NULL),
(245, 1, NULL, 'BALANCED SENIOR RAZAS PEQUEÑAS x3Kg', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(246, 1, NULL, 'BALANCED SENIOR RAZAS PEQUEÑAS x7,5Kg', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 8400.00, NULL, NULL, NULL),
(247, 1, NULL, 'BALANCED SENIOR RAZAS MEDIANAS x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(248, 1, NULL, 'BALANCED SENIOR RAZAS MEDIANAS x12Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, NULL, 8167.00, NULL, NULL, NULL),
(249, 1, NULL, 'BALANCED SENIOR RAZAS GRANDES x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(250, 1, NULL, 'BALANCED SENIOR RAZAS GRANDES x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(251, 1, NULL, 'BALANCED CONTROL DE PESO ALL AGE x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(252, 1, NULL, 'BALANCED CONTROL DE PESO ALL AGE x12Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, NULL, 8167.00, NULL, NULL, NULL),
(253, 1, NULL, 'BALANCED CONTROL DE PESO ALL AGE x20Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, NULL, 6300.00, NULL, NULL, NULL),
(254, 1, NULL, 'BALANCED NATURAL RECIPE CERDO x3Kg.', 'Alimento balanceado para mascotas PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(255, 1, NULL, 'BALANCED NATURAL RECIPE CERDO x15Kg.', 'Alimento balanceado para mascotas PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(256, 1, NULL, 'BALANCED NATURAL RECIPE CORDERO x3Kg.', 'Alimento balanceado para mascotas PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(257, 1, NULL, 'BALANCED NATURAL RECIPE CORDERO x15Kg.', 'Alimento balanceado para mascotas PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(258, 1, NULL, 'BALANCED KITTEN x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, NULL, 12600.00, NULL, NULL, NULL),
(259, 1, NULL, 'BALANCED KITTEN x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 9333.00, NULL, NULL, NULL),
(260, 1, NULL, 'BALANCED GATO ADULTO x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, NULL, 12600.00, NULL, NULL, NULL),
(261, 1, NULL, 'BALANCED GATO ADULTO x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 9333.00, NULL, NULL, NULL),
(262, 1, NULL, 'BALANCED GATO ADULTO x15Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(263, 1, NULL, 'BALANCED GATO HIGH PROTEIN POLLO Y ARROZ x3Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, NULL, 11667.00, NULL, NULL, NULL),
(264, 1, NULL, 'BALANCED GATO HIGH PROTEIN POLLO Y ARROZ x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 8400.00, NULL, NULL, NULL),
(265, 1, NULL, 'BALANCED GATO SENIOR x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, NULL, 12600.00, NULL, NULL, NULL),
(266, 1, NULL, 'BALANCED GATO SENIOR x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 9333.00, NULL, NULL, NULL),
(267, 1, NULL, 'BALANCED GATO CONTROL DE PESO/CASTRADOS x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, NULL, 12600.00, NULL, NULL, NULL),
(268, 1, NULL, 'BALANCED GATO CONTROL DE PESO/CASTRADOS x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 9333.00, NULL, NULL, NULL),
(269, 1, NULL, 'BALANCED CONTROL PH x2Kg.', 'Alimento balanceado para mascotas PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, NULL, 12600.00, NULL, NULL, NULL),
(270, 1, NULL, 'BALANCED CONTROL PH x7,5Kg.', 'Alimento balanceado para mascotas PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 9333.00, NULL, NULL, NULL),
(271, 1, NULL, 'VITAL CAN PREMIUM URINARY GATOS AD. x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 8400.00, NULL, NULL, NULL),
(272, 1, NULL, 'VITAL CAN PREMIUM GATO ADULTO SAFETY PACK x 24Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 24.00, NULL, 1, NULL, NULL, 5600.00, NULL, NULL, NULL),
(273, 1, NULL, 'VITAL CAN PREMIUM GATO ADULTO x15Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(274, 1, NULL, 'VITAL CAN PREMIUM GATO ADULTO x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 8400.00, NULL, NULL, NULL),
(275, 1, NULL, 'VITAL CAN PREMIUM GATO CACHORRO x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, NULL, 12600.00, NULL, NULL, NULL),
(276, 1, NULL, 'VITAL CAN PREMIUM GATO CACHORRO x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 9333.00, NULL, NULL, NULL),
(277, 1, NULL, 'VITAL CAN PREMIUM PERRO ADULTO SAFETY PACK x24Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 24.00, NULL, 1, NULL, NULL, 5600.00, NULL, NULL, NULL),
(278, 1, NULL, 'VITAL CAN PREMIUM PERRO ADULTO x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(279, 1, NULL, 'VITAL CAN PREMIUM PERRO ADULTO x20Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, NULL, 6300.00, NULL, NULL, NULL),
(280, 1, NULL, 'VITAL CAN PREMIUM RAZAS PEQUEÑAS x20Kg', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, NULL, 6300.00, NULL, NULL, NULL),
(281, 1, NULL, 'VITAL CAN PREMIUM RAZAS PEQUEÑAS x7,5Kg', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 8400.00, NULL, NULL, NULL),
(282, 1, NULL, 'VITAL CAN PREMIUM CACHORROS x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, NULL, 7467.00, NULL, NULL, NULL),
(283, 1, NULL, 'VITAL CAN PREMIUM CACHORROS x20Kg,', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, NULL, 6300.00, NULL, NULL, NULL),
(284, 1, NULL, 'VITAL CAN PREMIUM CORDERO x20Kg,', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, NULL, 6300.00, NULL, NULL, NULL),
(285, 1, NULL, 'VITAL CAN PREMIUM CORDERO x7,5Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, NULL, 8400.00, NULL, NULL, NULL),
(286, 1, NULL, 'BELCAN CACHORRO x1,5Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 1.50, NULL, 1, NULL, 15, 18666.00, NULL, NULL, NULL),
(287, 1, NULL, 'BELCAN CACHORRO x3Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 20, 14000.00, NULL, NULL, NULL),
(288, 1, NULL, 'BELCAN JUNIOR x15Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 3733.00, NULL, NULL, NULL),
(289, 1, NULL, 'BELCAN ADULTOS SAFETY PACK x24Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 24.00, NULL, 1, NULL, 30, 2916.00, NULL, NULL, NULL),
(290, 1, NULL, 'BELCAN ADULTOS x22Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 22.00, NULL, 1, NULL, 18, 3818.00, NULL, NULL, NULL),
(291, 1, NULL, 'BELCAN ADULTOS x15Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 22, 6533.00, NULL, NULL, NULL),
(292, 1, NULL, 'BELCAN ADULTOS x1,5Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 1.50, NULL, 1, NULL, 25, 74666.00, NULL, NULL, NULL),
(293, 1, NULL, 'BELCAN ADULTOS x3Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 30, 42000.00, NULL, NULL, NULL),
(294, 1, NULL, 'BELCAT SAFETY PACK x24Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 24.00, NULL, 1, NULL, 10, 875.00, NULL, NULL, NULL),
(295, 1, NULL, 'BELCAT x10Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 12, 2800.00, NULL, NULL, NULL),
(296, 1, NULL, 'BELCAT x1Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 15, 35000.00, NULL, NULL, NULL),
(297, 1, NULL, 'BELCAT x500grs.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 0.50, NULL, 1, NULL, 20, 84000.00, NULL, NULL, NULL),
(298, 1, NULL, 'COMPLETE GATO KITTEN 1,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 1.50, NULL, 1, NULL, 22, 32666.00, NULL, NULL, NULL),
(299, 1, NULL, 'COMPLETE GATO KITTEN 7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, 25, 7466.00, NULL, NULL, NULL),
(300, 1, NULL, 'COMPLETE GATO KITTEN x15Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 28, 4200.00, NULL, NULL, NULL),
(301, 1, NULL, 'COMPLETE GATO ADULTO x1,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 1.50, NULL, 1, NULL, 18, 46666.00, NULL, NULL, NULL),
(302, 1, NULL, 'COMPLETE GATO ADULTO x15Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 20, 5133.00, NULL, NULL, NULL),
(303, 1, NULL, 'COMPLETE GATO ADULTO SAFETY PACK x24Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 24.00, NULL, 1, NULL, 22, 3500.00, NULL, NULL, NULL),
(304, 1, NULL, 'COMPLETE GATO CONTROL PESO/CASTRADO 1,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 1.50, NULL, 1, NULL, 25, 60666.00, NULL, NULL, NULL),
(305, 1, NULL, 'COMPLETE GATO CONTROL PESO/CASTRADO 7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, 28, 13066.00, NULL, NULL, NULL),
(306, 1, NULL, 'COMPLETE GATO SENIOR 1,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 1.50, NULL, 1, NULL, 30, 70000.00, NULL, NULL, NULL),
(307, 1, NULL, 'COMPLETE GATO SENIOR 7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, 10, 14933.00, NULL, NULL, NULL),
(308, 1, NULL, 'THERAPY CANINE CARDIAC HEALTH x2Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 12, 59500.00, NULL, NULL, NULL),
(309, 1, NULL, 'THERAPY CANINE CARDIAC HEALTH x10Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 15, 8400.00, NULL, NULL, NULL),
(310, 1, NULL, 'THERAPY CANINE GASTROINTESTINAL A. x2Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 20, 10500.00, NULL, NULL, NULL),
(311, 1, NULL, 'THERAPY CANINE GASTROINTESTINAL A. x10Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 22, 2800.00, NULL, NULL, NULL),
(312, 1, NULL, 'THERAPY CANINE HYPOALLERGENIC C. x2Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 25, 17500.00, NULL, NULL, NULL),
(313, 1, NULL, 'THERAPY CANINE HYPOALLERGENIC C. x10Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 30, 4200.00, NULL, NULL, NULL),
(314, 1, NULL, 'THERAPY CANINE MOBILITY AID x2Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 22, 24500.00, NULL, NULL, NULL),
(315, 1, NULL, 'THERAPY CANINE MOBILITY AID x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 3733.00, NULL, NULL, NULL),
(316, 1, NULL, 'THERAPY CANINE OBESITY MGNT. x2Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 28, 31500.00, NULL, NULL, NULL),
(317, 1, NULL, 'THERAPY CANINE OBESITY MGNT. x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 30, 4666.00, NULL, NULL, NULL),
(318, 1, NULL, 'THERAPY CANINE RENAL CARE x2Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 18, 38500.00, NULL, NULL, NULL),
(319, 1, NULL, 'THERAPY CANINE RENAL CARE x10Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 20, 8400.00, NULL, NULL, NULL);
INSERT INTO `producto` (`codProducto`, `codCategoria`, `codTamanio`, `nombre`, `descripcion`, `peso`, `mililitro`, `estado`, `imagen`, `stock`, `precioSuelto`, `precioVenta`, `precioCompra`, `pesoTotal`) VALUES
(320, 1, NULL, 'THERAPY FELINE GASTROINTENTINAL A. x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 25, 45500.00, NULL, NULL, NULL),
(321, 1, NULL, 'THERAPY FELINE HIPOALLERGENIC x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 30, 49000.00, NULL, NULL, NULL),
(322, 1, NULL, 'THERAPY FELINE OBESITY MGNT. x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 12, 52500.00, NULL, NULL, NULL),
(323, 1, NULL, 'THERAPY FELINE RENAL CARE x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 15, 56000.00, NULL, NULL, NULL),
(324, 1, NULL, 'THERAPY FELINE URINARY HEALTH x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 20, 59500.00, NULL, NULL, NULL),
(325, 1, NULL, 'THERAPY FELINE URINARY HEALTH x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, 22, 16800.00, NULL, NULL, NULL),
(326, 1, NULL, 'NUTRIQUE MOTHER & BABY DOG x12Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, 25, 1750.00, NULL, NULL, NULL),
(327, 1, NULL, 'NUTRIQUE TOY & MINI PUPPY x1Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 28, 28000.00, NULL, NULL, NULL),
(328, 1, NULL, 'NUTRIQUE TOY & MINI PUPPY x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 30, 11666.00, NULL, NULL, NULL),
(329, 1, NULL, 'NUTRIQUE MEDIUM PUPPY x1Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 10, 42000.00, NULL, NULL, NULL),
(330, 1, NULL, 'NUTRIQUE MEDIUM PUPPY x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 12, 16333.00, NULL, NULL, NULL),
(331, 1, NULL, 'NUTRIQUE MEDIUM PUPPY x12Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, 15, 4666.00, NULL, NULL, NULL),
(332, 1, NULL, 'NUTRIQUE LARGE PUPPY x1Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 18, 63000.00, NULL, NULL, NULL),
(333, 1, NULL, 'NUTRIQUE LARGE PUPPY x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 20, 4666.00, NULL, NULL, NULL),
(334, 1, NULL, 'NUTRIQUE TOY & MINI YOUNG ADULT DOG x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 22, 25666.00, NULL, NULL, NULL),
(335, 1, NULL, 'NUTRIQUE TOY & MINI YOUNG ADULT DOG x7,5Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, 25, 11200.00, NULL, NULL, NULL),
(336, 1, NULL, 'NUTRIQUE MEDIUM YOUNG ADULT DOG x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 28, 30333.00, NULL, NULL, NULL),
(337, 1, NULL, 'NUTRIQUE MEDIUM YOUNG ADULT DOG x12Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, 30, 8166.00, NULL, NULL, NULL),
(338, 1, NULL, 'NUTRIQUE LARGE YOUNG ADULT DOG x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 20, 35000.00, NULL, NULL, NULL),
(339, 1, NULL, 'NUTRIQUE LARGE YOUNG ADULT DOG x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 22, 7466.00, NULL, NULL, NULL),
(340, 1, NULL, 'NUTRIQUE HEALTHY WEIGHT DOG x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 25, 39666.00, NULL, NULL, NULL),
(341, 1, NULL, 'NUTRIQUE HEALTHY WEIGHT DOG x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 30, 8400.00, NULL, NULL, NULL),
(342, 1, NULL, 'NUTRIQUE SKIN SENSITIVITY DOG x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 18, 7000.00, NULL, NULL, NULL),
(343, 1, NULL, 'NUTRIQUE SKIN SENSITIVITY DOG x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 20, 1866.00, NULL, NULL, NULL),
(344, 1, NULL, 'NUTRIQUE TOY & MINI ADULT +7 DOG x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 22, 11666.00, NULL, NULL, NULL),
(345, 1, NULL, 'NUTRIQUE MEDIUM ADULT DOG +7 x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 25, 14000.00, NULL, NULL, NULL),
(346, 1, NULL, 'NUTRIQUE MEDIUM ADULT DOG +7 x12Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, 28, 4083.00, NULL, NULL, NULL),
(347, 1, NULL, 'NUTRIQUE LARGE ADULT DOG +6 x3Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 30, 18666.00, NULL, NULL, NULL),
(348, 1, NULL, 'NUTRIQUE LARGE ADULT DOG +6 x15Kg.', 'Alimento balanceado para perros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 10, 4200.00, NULL, NULL, NULL),
(349, 1, NULL, 'NUTRIQUE BABY CAT & KITTEN x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 12, 35000.00, NULL, NULL, NULL),
(350, 1, NULL, 'NUTRIQUE BABY CAT & KITTEN x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, 15, 10266.00, NULL, NULL, NULL),
(351, 1, NULL, 'NUTRIQUE YOUNG ADULT CAT HEALTHY MAINT. x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 18, 42000.00, NULL, NULL, NULL),
(352, 1, NULL, 'NUTRIQUE YOUNG ADULT CAT HEALTHY MAINT. x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, 20, 12133.00, NULL, NULL, NULL),
(353, 1, NULL, 'NUTRIQUE YOUNG ADULT CAT STERYL/H. WEIGHT x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 22, 49000.00, NULL, NULL, NULL),
(354, 1, NULL, 'NUTRIQUE YOUNG ADULT CAT STERYL/H. WEIGHT x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, 25, 14000.00, NULL, NULL, NULL),
(355, 1, NULL, 'NUTRIQUE URINARY CARE CAT x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 28, 56000.00, NULL, NULL, NULL),
(356, 1, NULL, 'NUTRIQUE URINARY CARE CAT x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, 30, 15866.00, NULL, NULL, NULL),
(357, 1, NULL, 'NUTRIQUE ADULT +7 CAT HEALTHY MAINTENANCE x2Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 2.00, NULL, 1, NULL, 18, 63000.00, NULL, NULL, NULL),
(358, 1, NULL, 'NUTRIQUE ADULT +7CAT HEALTHY MAINTENANCE x7,5Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 7.50, NULL, 1, NULL, 20, 28000.00, NULL, NULL, NULL),
(359, 1, NULL, 'SIEGER PUPPY MINI & SMALL x1Kg.', 'Alimento balanceado para cachorros mini y pequeños PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 10, 28000.00, NULL, NULL, NULL),
(360, 1, NULL, 'SIEGER PUPPY MINI & SMALL x3Kg.', 'Alimento balanceado para cachorros mini y pequeños PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 15, 14000.00, NULL, NULL, NULL),
(361, 1, NULL, 'SIEGER PUPPY MINI & SMALL x12Kg.', 'Alimento balanceado para cachorros mini y pequeños PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, 20, 4666.67, NULL, NULL, NULL),
(362, 1, NULL, 'SIEGER PUPPY MEDIUM & LARGE x1Kg.', 'Alimento balanceado para cachorros medianos y grandes PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 12, 35000.00, NULL, NULL, NULL),
(363, 1, NULL, 'SIEGER PUPPY MEDIUM & LARGE x3Kg.', 'Alimento balanceado para cachorros medianos y grandes PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 18, 16333.33, NULL, NULL, NULL),
(364, 1, NULL, 'SIEGER PUPPY MEDIUM & LARGE x15Kg.', 'Alimento balanceado para cachorros medianos y grandes PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 4200.00, NULL, NULL, NULL),
(365, 1, NULL, 'SIEGER ADULT MINI & SMALL x1Kg.', 'Alimento balanceado para adultos mini y pequeños PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 8, 25200.00, NULL, NULL, NULL),
(366, 1, NULL, 'SIEGER ADULT MINI & SMALL x3Kg.', 'Alimento balanceado para adultos mini y pequeños PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 14, 13066.67, NULL, NULL, NULL),
(367, 1, NULL, 'SIEGER ADULT MINI & SMALL x12Kg.', 'Alimento balanceado para adultos mini y pequeños PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, 22, 4433.33, NULL, NULL, NULL),
(368, 1, NULL, 'SIEGER ADULT MEDIUM & LARGE x3Kg.', 'Alimento balanceado para adultos medianos y grandes PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 16, 14000.00, NULL, NULL, NULL),
(369, 1, NULL, 'SIEGER ADULT MEDIUM & LARGE x15Kg.', 'Alimento balanceado para adultos medianos y grandes PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 30, 4666.67, NULL, NULL, NULL),
(370, 1, NULL, 'SIEGER SENIOR MINI +7 x1Kg.', 'Alimento balanceado para senior mini +7 PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 5, 21000.00, NULL, NULL, NULL),
(371, 1, NULL, 'SIEGER SENIOR MINI +7 x3Kg', 'Alimento balanceado para senior mini +7 PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 10, 11666.67, NULL, NULL, NULL),
(372, 1, NULL, 'SIEGER SENIOR MINI +7 x12Kg', 'Alimento balanceado para senior mini +7 PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, 18, 4083.33, NULL, NULL, NULL),
(373, 1, NULL, 'SIEGER SENIOR MEDIUM & LARGE x3Kg.', 'Alimento balanceado para senior medianos y grandes PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 14, 13066.67, NULL, NULL, NULL),
(374, 1, NULL, 'SIEGER SENIOR MEDIUM & LARGE x15Kg.', 'Alimento balanceado para senior medianos y grandes PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 4200.00, NULL, NULL, NULL),
(375, 1, NULL, 'SIEGER REDUCED CALORIE x3Kg.', 'Alimento balanceado para reducción de calorías PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 10, 9333.33, NULL, NULL, NULL),
(376, 1, NULL, 'SIEGER REDUCED CALORIE x12Kg.', 'Alimento balanceado para reducción de calorías PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, 20, 4666.67, NULL, NULL, NULL),
(377, 1, NULL, 'SIEGER DERMAPROTECT x3Kg.', 'Alimento balanceado para protección dérmica PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 12, 11666.67, NULL, NULL, NULL),
(378, 1, NULL, 'SIEGER DERMAPROTECT x12Kg.', 'Alimento balanceado para protección dérmica PET FRIEND / PuntoVet', 12.00, NULL, 1, NULL, 18, 4083.33, NULL, NULL, NULL),
(379, 1, NULL, 'SIEGER CRIADORES x20Kg.', 'Alimento balanceado para criadores PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 30, 4200.00, NULL, NULL, NULL),
(380, 1, NULL, 'SIEGER ULTRA OSTEOARTICULAR x1,5Kg.', 'Alimento balanceado para osteoarticular ultra PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 10, 20533.33, NULL, NULL, NULL),
(381, 1, NULL, 'SIEGER ULTRA VITA PLUS x1,5Kg.', 'Alimento balanceado para vita plus ultra PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 10, 23333.33, NULL, NULL, NULL),
(382, 1, NULL, 'SIEGER MASH PUPPYS x1,5Kg.', 'Alimento balanceado para cachorros mash PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 10, 16800.00, NULL, NULL, NULL),
(383, 1, NULL, 'SIEGER KATZE ADULTO x1Kg.', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 8, 23800.00, NULL, NULL, NULL),
(384, 1, NULL, 'SIEGER KATZE ADULTO x7,5Kg.', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 7.00, NULL, 1, NULL, 20, 7000.00, NULL, NULL, NULL),
(385, 1, NULL, 'MAXXIUM CACHORRO x3Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 15, 11666.00, NULL, NULL, NULL),
(386, 1, NULL, 'MAXXIUM CACHORRO x15Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 20, 5133.00, NULL, NULL, NULL),
(387, 1, NULL, 'MAXXIUM CACHORRO x20Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 25, 4550.00, NULL, NULL, NULL),
(388, 1, NULL, 'MAXXIUM ADULTO x3Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 10, 8400.00, NULL, NULL, NULL),
(389, 1, NULL, 'MAXXIUM ADULTO x15Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 30, 7000.00, NULL, NULL, NULL),
(390, 1, NULL, 'MAXXIUM ADULTO x20Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 25, 5600.00, NULL, NULL, NULL),
(391, 1, NULL, 'MAXXIUM ADULTO CORDERO x3Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 20, 9333.00, NULL, NULL, NULL),
(392, 1, NULL, 'MAXXIUM ADULTO CORDERO x15Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 30, 7933.00, NULL, NULL, NULL),
(393, 1, NULL, 'AGILITY ADULTO x3Kg ', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 10, 8400.00, NULL, NULL, NULL),
(394, 1, NULL, 'AGILITY ADULTO x15Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 7000.00, NULL, NULL, NULL),
(395, 1, NULL, 'AGILITY ADULTO x20Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 20, 5600.00, NULL, NULL, NULL),
(396, 1, NULL, 'AGILITY CACHORRO x3Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 15, 9333.00, NULL, NULL, NULL),
(397, 1, NULL, 'AGILITY CACHORRO x15Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 30, 7933.00, NULL, NULL, NULL),
(398, 1, NULL, 'AGILITY CACHORROx20Kg.', 'Alimento balanceado para cachorros PET FRIEND / PuntoVet', 20.00, NULL, 1, NULL, 25, 6300.00, NULL, NULL, NULL),
(399, 1, NULL, 'AGILITY ADULTO TALLA PEQUEÑA x3Kg', 'Alimento balanceado para adultos de talla pequeña PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 10, 9333.00, NULL, NULL, NULL),
(400, 1, NULL, 'AGILITY ADULTO TALLA PEQUEÑA x15Kg', 'Alimento balanceado para adultos de talla pequeña PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 20, 7933.00, NULL, NULL, NULL),
(401, 1, NULL, 'AGILITY DERMA CONTROL ADULTO x3Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 3.00, NULL, 1, NULL, 15, 9333.00, NULL, NULL, NULL),
(402, 1, NULL, 'AGILITY DERMA CONTROL ADULTO x15Kg.', 'Alimento balanceado para adultos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 25, 7933.00, NULL, NULL, NULL),
(403, 1, NULL, 'AGILITY CATS KITTEN x1,5Kg.', 'Alimento balanceado para gatitos PET FRIEND / PuntoVet', 1.50, NULL, 1, NULL, 20, 14000.00, NULL, NULL, NULL),
(404, 1, NULL, 'AGILITY CATS KITTEN x10Kg.', 'Alimento balanceado para gatitos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 30, 8400.00, NULL, NULL, NULL),
(405, 1, NULL, 'AGILITY CATS ADULTO x1,5Kg.', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 1.50, NULL, 1, NULL, 15, 14933.00, NULL, NULL, NULL),
(406, 1, NULL, 'AGILITY CATS ADULTO x10Kg.', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 25, 9100.00, NULL, NULL, NULL),
(407, 1, NULL, 'AGILITY CATS CONTROL DE PESO x1,5Kg.', 'Alimento balanceado para gatos control de peso PET FRIEND / PuntoVet', 1.50, NULL, 1, NULL, 20, 16800.00, NULL, NULL, NULL),
(408, 1, NULL, 'AGILITY CATS CONTROL DE PESO x10Kg.', 'Alimento balanceado para gatos control de peso PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 25, 10500.00, NULL, NULL, NULL),
(409, 1, NULL, 'AGILITY CATS URINARY x1,5Kg.', 'Alimento balanceado para gatos con problemas urinarios PET FRIEND / PuntoVet', 1.50, NULL, 1, NULL, 15, 16800.00, NULL, NULL, NULL),
(410, 1, NULL, 'AGILITY CATS URINARY x10Kg.', 'Alimento balanceado para gatos con problemas urinarios PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 25, 10500.00, NULL, NULL, NULL),
(411, 1, NULL, '7 VIDAS x1Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 1.00, NULL, 1, NULL, 20, 21000.00, NULL, NULL, NULL),
(412, 1, NULL, '7 VIDAS x10Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 10.00, NULL, 1, NULL, 30, 8400.00, NULL, NULL, NULL),
(413, 1, NULL, 'GOOSTER GATO PESCADO x15Kg.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 15.00, NULL, 1, NULL, 15, 5133.00, NULL, NULL, NULL),
(414, 1, NULL, 'LATA SIEGER ADULTO Salmón y pollo x340grs', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 0.34, NULL, 1, NULL, 10, 70000.00, NULL, NULL, NULL),
(415, 1, NULL, 'LATA SIEGER CRIADORES Pollo x340grs.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 0.34, NULL, 1, NULL, 20, 74000.00, NULL, NULL, NULL),
(416, 1, NULL, 'POUCH SIEGER CRIADORES Pollo x100grs.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 0.10, NULL, 1, NULL, 25, 266000.00, NULL, NULL, NULL),
(417, 1, NULL, 'POUCH SIEGER ADULTO Salmón y pollo x100grs', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 0.10, NULL, 1, NULL, 20, 252000.00, NULL, NULL, NULL),
(418, 1, NULL, 'POUCH SIEGER PUPPY Salmón y pollo x100grs', 'Alimento balanceado para gatitos PET FRIEND / PuntoVet', 0.10, NULL, 1, NULL, 30, 294000.00, NULL, NULL, NULL),
(419, 1, NULL, 'LATA SIEGER KATZE KITTEN Pollo x340gra.', 'Alimento balanceado para gatitos PET FRIEND / PuntoVet', 0.34, NULL, 1, NULL, 10, 70000.00, NULL, NULL, NULL),
(420, 1, NULL, 'LATA SIEGER KATZE KITTEN Pollo x90grs.', 'Alimento balanceado para gatitos PET FRIEND / PuntoVet', 0.09, NULL, 1, NULL, 15, 84000.00, NULL, NULL, NULL),
(421, 1, NULL, 'LATA SIEGER KATZE ADULT Salmón y pollo x340grs', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 0.34, NULL, 1, NULL, 20, 74000.00, NULL, NULL, NULL),
(422, 1, NULL, 'LATA SIEGER KATZE ADULT Salmón y pollo x90grs', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 0.09, NULL, 1, NULL, 25, 93333.00, NULL, NULL, NULL),
(423, 1, NULL, 'LATA SIEGER KATZE URINARY x340grs.', 'Alimento balanceado para gatos con problemas urinarios PET FRIEND / PuntoVet', 0.34, NULL, 1, NULL, 15, 70000.00, NULL, NULL, NULL),
(424, 1, NULL, 'LATA SIEGER KATZE URINARY x90grs.', 'Alimento balanceado para gatos con problemas urinarios PET FRIEND / PuntoVet', 0.09, NULL, 1, NULL, 10, 93333.00, NULL, NULL, NULL),
(425, 1, NULL, 'POUCH SIEGER KATZE KITTEN Pollo x100grs.', 'Alimento balanceado para gatitos PET FRIEND / PuntoVet', 0.10, NULL, 1, NULL, 25, 252000.00, NULL, NULL, NULL),
(426, 1, NULL, 'POUCH SIEGER KATZE ADULT Salmón y pollo x100grs', 'Alimento balanceado para gatos adultos PET FRIEND / PuntoVet', 0.10, NULL, 1, NULL, 20, 238000.00, NULL, NULL, NULL),
(427, 1, NULL, 'POUCH SIEGER KATZE URINARY x100grs.', 'Alimento balanceado para gatos con problemas urinarios PET FRIEND / PuntoVet', 0.10, NULL, 1, NULL, 15, 224000.00, NULL, NULL, NULL),
(428, 1, NULL, 'LATA MAXXIUM DOG ADULTO Cordero x340grs.', 'Alimento balanceado para perros adultos PET FRIEND / PuntoVet', 0.34, NULL, 1, NULL, 15, 78000.00, NULL, NULL, NULL),
(429, 1, NULL, 'LATA 7 VIDAS x340grs.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 0.34, NULL, 1, NULL, 20, 74000.00, NULL, NULL, NULL),
(430, 1, NULL, 'LATA 7 VIDAS x90grs.', 'Alimento balanceado para gatos PET FRIEND / PuntoVet', 0.09, NULL, 1, NULL, 25, 93333.00, NULL, NULL, NULL),
(431, 5, 2, 'Piedra Sanitaria GATOS X KG', 'Piedra sanitaria para gatos x KG (Marca: MININO)', 4.00, NULL, 1, 'undefined/file-1776617733720.jpg', 1, 1000.00, 10000.00, 8350.00, 4.000),
(432, 2, 3, 'asd', 'asdasddsaasdasda', 22.00, NULL, 1, 'undefined/file-1776626878094.jpg', 5, NULL, 2323.00, 123213.00, 110.000),
(433, 2, 2, 'Nanito', 'Nanito nanon nana', 3.00, NULL, 1, 'undefined/file-1776740125040.jpg', 11, 4666.67, 12000.00, 10000.00, 33.000),
(434, 4, NULL, 'Piedras Sanitarias', 'Piedras sanitarias para gatos x10kg', 10.00, NULL, 0, 'undefined/file-1776967638012.jpg', 5, 1200.00, 12000.00, 10000.00, 50.000),
(435, 2, NULL, 'aaaa', 'asasdasdas', 1.00, NULL, 1, 'undefined/file-1778027427983.png', 1, NULL, 1200.00, 1000.00, 1.000),
(436, 2, 1, 'asd', 'asdasdasdadsadd', 111.00, NULL, 1, 'default.jpg', 150, 2900.00, 28500.00, 24500.00, 9999.999),
(437, 2, 3, 'Prueba', 'Probando 1 , 2 ,3 ', 15.00, NULL, 1, 'default.jpg', 150, 2800.00, 28000.00, 25000.00, 2250.000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_edad`
--

DROP TABLE IF EXISTS `producto_edad`;
CREATE TABLE `producto_edad` (
  `codProducto` int(11) NOT NULL,
  `codEdad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `producto_edad`
--

TRUNCATE TABLE `producto_edad`;
--
-- Volcado de datos para la tabla `producto_edad`
--

INSERT INTO `producto_edad` (`codProducto`, `codEdad`) VALUES
(1, 1),
(2, 4),
(3, 2),
(5, 4),
(7, 1),
(8, 4),
(9, 1),
(11, 4),
(12, 1),
(13, 4),
(16, 4),
(17, 1),
(18, 1),
(19, 4),
(21, 1),
(22, 4),
(22, 5),
(24, 5),
(25, 4),
(26, 1),
(28, 4),
(29, 1),
(30, 4),
(31, 4),
(32, 1),
(33, 4),
(34, 4),
(42, 4),
(44, 4),
(45, 1),
(431, 4),
(432, 1),
(433, 1),
(434, 4),
(435, 2),
(436, 2),
(437, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_mascota`
--

DROP TABLE IF EXISTS `producto_mascota`;
CREATE TABLE `producto_mascota` (
  `codMascota` int(11) NOT NULL,
  `codProducto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `producto_mascota`
--

TRUNCATE TABLE `producto_mascota`;
--
-- Volcado de datos para la tabla `producto_mascota`
--

INSERT INTO `producto_mascota` (`codMascota`, `codProducto`) VALUES
(1, 1),
(1, 2),
(1, 5),
(1, 11),
(1, 14),
(1, 15),
(1, 24),
(1, 25),
(1, 26),
(1, 29),
(1, 30),
(1, 31),
(1, 32),
(1, 33),
(1, 34),
(1, 35),
(1, 43),
(1, 44),
(1, 45),
(1, 432),
(1, 433),
(2, 3),
(2, 4),
(2, 10),
(2, 12),
(2, 13),
(2, 16),
(2, 20),
(2, 23),
(2, 36),
(2, 42),
(2, 431),
(2, 434),
(2, 435),
(2, 436),
(2, 437);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `storage`
--

DROP TABLE IF EXISTS `storage`;
CREATE TABLE `storage` (
  `url` varchar(100) DEFAULT NULL,
  `fileName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `storage`
--

TRUNCATE TABLE `storage`;
--
-- Volcado de datos para la tabla `storage`
--

INSERT INTO `storage` (`url`, `fileName`) VALUES
('undefined/file-1776617733720.jpg', 'file-1776617733720.jpg'),
('undefined/file-1776626878094.jpg', 'file-1776626878094.jpg'),
('undefined/file-1776740125040.jpg', 'file-1776740125040.jpg'),
('undefined/file-1776967638012.jpg', 'file-1776967638012.jpg'),
('undefined/file-1778027427983.png', 'file-1778027427983.png'),
('undefined/file-1780976642434.png', 'file-1780976642434.png'),
('undefined/file-1781018136269.png', 'file-1781018136269.png'),
('undefined/file-1781018204952.png', 'file-1781018204952.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tamanio`
--

DROP TABLE IF EXISTS `tamanio`;
CREATE TABLE `tamanio` (
  `codTamanio` int(11) NOT NULL,
  `nombreTamanio` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `tamanio`
--

TRUNCATE TABLE `tamanio`;
--
-- Volcado de datos para la tabla `tamanio`
--

INSERT INTO `tamanio` (`codTamanio`, `nombreTamanio`) VALUES
(1, 'Chico'),
(2, 'Mediano'),
(3, 'Grande');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_pago`
--

DROP TABLE IF EXISTS `tipo_pago`;
CREATE TABLE `tipo_pago` (
  `codTipoPago` int(11) NOT NULL,
  `nombreTipoPago` varchar(100) DEFAULT NULL,
  `recargo` double(5,2) NOT NULL DEFAULT 0.00,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `tipo_pago`
--

TRUNCATE TABLE `tipo_pago`;
--
-- Volcado de datos para la tabla `tipo_pago`
--

INSERT INTO `tipo_pago` (`codTipoPago`, `nombreTipoPago`, `recargo`, `estado`) VALUES
(1, 'Efectivo', 0.00, 1),
(2, 'Débito/Transferencia', 0.00, 1),
(3, 'Tarjeta Crédito', 0.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_usuario`
--

DROP TABLE IF EXISTS `tipo_usuario`;
CREATE TABLE `tipo_usuario` (
  `codTipoUsuario` int(11) NOT NULL,
  `tipoUsuario` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `tipo_usuario`
--

TRUNCATE TABLE `tipo_usuario`;
--
-- Volcado de datos para la tabla `tipo_usuario`
--

INSERT INTO `tipo_usuario` (`codTipoUsuario`, `tipoUsuario`) VALUES
(1, 'Administrador'),
(2, 'Vendedor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `codUsuario` int(11) NOT NULL,
  `nombreApellido` varchar(100) NOT NULL,
  `celular` varchar(100) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `password` varchar(60) NOT NULL,
  `codTipoUsuario` int(11) NOT NULL,
  `user` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `usuario`
--

TRUNCATE TABLE `usuario`;
--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`codUsuario`, `nombreApellido`, `celular`, `estado`, `password`, `codTipoUsuario`, `user`) VALUES
(1, 'Nahuel Aguirre', '+54 9 3794 407-4449', 1, 'admin123', 1, 'nano'),
(2, 'Matias Benites', '3794341097', 1, '$2b$08$dCGmjERu6I5IKrzyZcY9deSfe7lvG3f6iAN9Go4.tLoQLoXcbJV8K', 2, 'matute'),
(3, 'Jose Suarez', '3794010101', 0, '$2b$08$P.XAf5thE/egHcwxzkJjb.nFFSHOdMKWmbTbAzJViXcKv4SG0sowC', 2, 'josecito');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

DROP TABLE IF EXISTS `venta`;
CREATE TABLE `venta` (
  `codVenta` int(11) NOT NULL,
  `codTipoPago` int(11) DEFAULT NULL,
  `codUsuario` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `montoTotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `venta`
--

TRUNCATE TABLE `venta`;
--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`codVenta`, `codTipoPago`, `codUsuario`, `fecha`, `montoTotal`) VALUES
(2, 1, 1, '2026-06-04', 163.33),
(3, 3, 1, '2026-06-05', 11.92),
(4, 2, 1, '2026-06-09', 2000.00),
(5, 1, 1, '2026-06-09', 2000.00),
(6, 3, 1, '2026-06-09', 2000.00),
(7, 1, 2, '2026-06-09', 5000.00),
(8, 1, 2, '2026-06-09', 50000.00),
(9, 1, 2, '2026-06-09', 50000.00),
(10, 1, 1, '2026-06-09', 175000.00),
(11, 1, 1, '2026-06-09', 175000.00),
(12, 1, 2, '2026-06-09', 20000.00),
(13, 1, 2, '2026-06-09', 20000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta_detalle`
--

DROP TABLE IF EXISTS `venta_detalle`;
CREATE TABLE `venta_detalle` (
  `codVentaDetalle` int(11) NOT NULL,
  `codVenta` int(11) NOT NULL,
  `codProducto` int(11) DEFAULT NULL,
  `cantidad` double(7,3) NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `subTotal` decimal(10,2) NOT NULL,
  `tipoVenta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Truncar tablas antes de insertar `venta_detalle`
--

TRUNCATE TABLE `venta_detalle`;
--
-- Volcado de datos para la tabla `venta_detalle`
--

INSERT INTO `venta_detalle` (`codVentaDetalle`, `codVenta`, `codProducto`, `cantidad`, `precioUnitario`, `subTotal`, `tipoVenta`) VALUES
(1, 2, 1, 1.000, 163.33, 163.33, NULL),
(2, 3, 1, 0.000, 163.33, 11.92, 1),
(3, 4, 1, 2.000, 1000.00, 2000.00, 2),
(4, 5, 1, 2.000, 1000.00, 2000.00, 2),
(5, 6, 1, 2.000, 1000.00, 2000.00, 2),
(6, 7, 1, 5.000, 1000.00, 5000.00, 2),
(7, 8, 1, 50.000, 1000.00, 50000.00, 2),
(8, 9, 1, 50.000, 1000.00, 50000.00, 2),
(9, 10, 1, 1.000, 175000.00, 175000.00, 3),
(10, 11, 1, 1.000, 175000.00, 175000.00, 3),
(11, 12, 431, 2.000, 10000.00, 20000.00, 3),
(12, 13, 431, 2.000, 10000.00, 20000.00, 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`codCategoria`);

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`codCompra`),
  ADD KEY `codUsuario` (`codUsuario`);

--
-- Indices de la tabla `compra_detalle`
--
ALTER TABLE `compra_detalle`
  ADD PRIMARY KEY (`codCompraDetalle`,`codCompra`),
  ADD KEY `codProducto` (`codProducto`);

--
-- Indices de la tabla `edad`
--
ALTER TABLE `edad`
  ADD PRIMARY KEY (`codEdad`);

--
-- Indices de la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD PRIMARY KEY (`codMascota`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`codProducto`),
  ADD KEY `codTamanio` (`codTamanio`),
  ADD KEY `codCategoria` (`codCategoria`);

--
-- Indices de la tabla `producto_edad`
--
ALTER TABLE `producto_edad`
  ADD PRIMARY KEY (`codProducto`,`codEdad`),
  ADD KEY `codEdad` (`codEdad`);

--
-- Indices de la tabla `producto_mascota`
--
ALTER TABLE `producto_mascota`
  ADD PRIMARY KEY (`codMascota`,`codProducto`),
  ADD KEY `codProducto` (`codProducto`);

--
-- Indices de la tabla `storage`
--
ALTER TABLE `storage`
  ADD PRIMARY KEY (`fileName`);

--
-- Indices de la tabla `tamanio`
--
ALTER TABLE `tamanio`
  ADD PRIMARY KEY (`codTamanio`);

--
-- Indices de la tabla `tipo_pago`
--
ALTER TABLE `tipo_pago`
  ADD PRIMARY KEY (`codTipoPago`);

--
-- Indices de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  ADD PRIMARY KEY (`codTipoUsuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`codUsuario`),
  ADD UNIQUE KEY `user` (`user`),
  ADD KEY `codTipoUsuario` (`codTipoUsuario`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`codVenta`),
  ADD KEY `codTipoPago` (`codTipoPago`),
  ADD KEY `codUsuario` (`codUsuario`);

--
-- Indices de la tabla `venta_detalle`
--
ALTER TABLE `venta_detalle`
  ADD PRIMARY KEY (`codVentaDetalle`,`codVenta`),
  ADD KEY `codProducto` (`codProducto`),
  ADD KEY `codVenta` (`codVenta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `codCategoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `codCompra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `compra_detalle`
--
ALTER TABLE `compra_detalle`
  MODIFY `codCompraDetalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `edad`
--
ALTER TABLE `edad`
  MODIFY `codEdad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `mascota`
--
ALTER TABLE `mascota`
  MODIFY `codMascota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `codProducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=438;

--
-- AUTO_INCREMENT de la tabla `tamanio`
--
ALTER TABLE `tamanio`
  MODIFY `codTamanio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipo_pago`
--
ALTER TABLE `tipo_pago`
  MODIFY `codTipoPago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  MODIFY `codTipoUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `codUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `codVenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `venta_detalle`
--
ALTER TABLE `venta_detalle`
  MODIFY `codVentaDetalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuario` (`codUsuario`);

--
-- Filtros para la tabla `compra_detalle`
--
ALTER TABLE `compra_detalle`
  ADD CONSTRAINT `compra_detalle_ibfk_1` FOREIGN KEY (`codProducto`) REFERENCES `producto` (`codProducto`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`codTamanio`) REFERENCES `tamanio` (`codTamanio`),
  ADD CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`codCategoria`) REFERENCES `categoria` (`codCategoria`);

--
-- Filtros para la tabla `producto_edad`
--
ALTER TABLE `producto_edad`
  ADD CONSTRAINT `producto_edad_ibfk_1` FOREIGN KEY (`codProducto`) REFERENCES `producto` (`codProducto`),
  ADD CONSTRAINT `producto_edad_ibfk_2` FOREIGN KEY (`codEdad`) REFERENCES `edad` (`codEdad`);

--
-- Filtros para la tabla `producto_mascota`
--
ALTER TABLE `producto_mascota`
  ADD CONSTRAINT `producto_mascota_ibfk_1` FOREIGN KEY (`codMascota`) REFERENCES `mascota` (`codMascota`),
  ADD CONSTRAINT `producto_mascota_ibfk_2` FOREIGN KEY (`codProducto`) REFERENCES `producto` (`codProducto`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`codTipoUsuario`) REFERENCES `tipo_usuario` (`codTipoUsuario`);

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`codTipoPago`) REFERENCES `tipo_pago` (`codTipoPago`),
  ADD CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`codUsuario`) REFERENCES `usuario` (`codUsuario`);

--
-- Filtros para la tabla `venta_detalle`
--
ALTER TABLE `venta_detalle`
  ADD CONSTRAINT `venta_detalle_ibfk_1` FOREIGN KEY (`codProducto`) REFERENCES `producto` (`codProducto`),
  ADD CONSTRAINT `venta_detalle_ibfk_2` FOREIGN KEY (`codVenta`) REFERENCES `venta` (`codVenta`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
