CREATE DATABASE puntovet;
USE puntovet;

CREATE TABLE
    tipo_usuario (
        codTipoUsuario INT PRIMARY KEY AUTO_INCREMENT,
        tipoUsuario VARCHAR(40) NOT NULL
    );

CREATE TABLE
    usuario (
        codUsuario INT PRIMARY KEY AUTO_INCREMENT,
        nombreApellido VARCHAR(100) NOT NULL,
        celular VARCHAR(100) NULL,
        estado BOOLEAN default true,
        password VARCHAR(60) NOT NULL,
        codTipoUsuario INT NOT NULL,
        user VARCHAR(100) unique,
        FOREIGN KEY (codTipoUsuario) REFERENCES tipo_usuario (codTipoUsuario)
    );

CREATE TABLE
    categoria (
        codCategoria INT PRIMARY KEY AUTO_INCREMENT,
        nombreCategoria VARCHAR(100) NOT NULL
    );

CREATE TABLE
    mascota (
        codMascota INT PRIMARY KEY AUTO_INCREMENT,
        nombreMascota VARCHAR(100)
    );

CREATE TABLE
    edad (
        codEdad INT PRIMARY KEY AUTO_INCREMENT,
        nombreEdad VARCHAR(100)
    );

CREATE TABLE
    tamanio (
        codTamanio INT PRIMARY KEY AUTO_INCREMENT,
        nombreTamanio VARCHAR(100)
    );

CREATE TABLE
    producto (
        codProducto INT PRIMARY KEY AUTO_INCREMENT,
        codCategoria INT NOT NULL,
        codTamanio INT NULL,
        nombre VARCHAR(100) NOT NULL,
        descripcion VARCHAR(300) NULL,
        peso DOUBLE (5, 2) NULL,
        mililitro INT NULL,
        cantidad INT NULL,
        estado BOOLEAN DEFAULT TRUE,
        imagen VARCHAR(200) NULL,
        stock INT NULL,
        precioCompra VARCHAR (100) NULL,
        precioVenta VARCHAR(100) NULL,
        precioSuelto VARCHAR(100) NULL,
        pesoTotal VARCHAR (100) NULL,
        FOREIGN KEY (codTamanio) REFERENCES tamanio (codTamanio),
        FOREIGN KEY (codCategoria) REFERENCES categoria (codCategoria)
    );

CREATE TABLE
    producto_edad (
        codProducto INT,
        codEdad INT,
        PRIMARY KEY (codProducto, codEdad),
        FOREIGN KEY (codProducto) REFERENCES producto (codProducto),
        FOREIGN KEY (codEdad) REFERENCES edad (codEdad)
    );

CREATE TABLE
    producto_mascota (
        codMascota INT,
        codProducto INT,
        PRIMARY KEY (codMascota, codProducto),
        FOREIGN KEY (codMascota) REFERENCES mascota (codMascota),
        FOREIGN KEY (codProducto) REFERENCES producto (codProducto)
    );

CREATE TABLE
    tipo_pago (
        codTipoPago INT PRIMARY KEY AUTO_INCREMENT,
        nombreTipoPago VARCHAR(100),
        recargo DOUBLE (5,2),
        estado BOOLEAN DEFAULT TRUE
    );

CREATE TABLE
    venta (
        codVenta INT AUTO_INCREMENT,
        codTipoPago INT,
        codUsuario INT,
        fecha DATE,
        montoTotal VARCHAR(100),
        PRIMARY KEY (codVenta),
        FOREIGN KEY (codTipoPago) REFERENCES tipo_pago (codTipoPago),
        FOREIGN KEY (codUsuario) REFERENCES usuario (codUsuario)
    );

CREATE TABLE
    venta_detalle (
        codVentaDetalle INT AUTO_INCREMENT,
        codVenta INT,
        codProducto INT,
        cantidad DOUBLE (7,3) ,
        precioUnitario VARCHAR(100),
        subTotal VARCHAR(100),
        tipoVenta INT, 
        PRIMARY KEY (codVentaDetalle, codVenta),
        FOREIGN KEY (codProducto) REFERENCES producto (codProducto),
        FOREIGN KEY (codVenta) REFERENCES venta (codVenta)
    );

CREATE TABLE
    compra (
        codCompra INT AUTO_INCREMENT,
        codUsuario INT,
        fecha DATE,
        montoTotal VARCHAR(100),
        PRIMARY KEY (codCompra),
        FOREIGN KEY (codUsuario) REFERENCES usuario (codUsuario)
    );

CREATE TABLE
    compra_detalle (
        codCompraDetalle INT AUTO_INCREMENT,
        codCompra INT,
        codProducto INT,
        precioCompra VARCHAR(100),
        precioVenta VARCHAR(100),
        precioSuelto VARCHAR(100),
        cantidad INT,
        subTotal VARCHAR(100),
        PRIMARY KEY (codCompraDetalle, codCompra),
        FOREIGN KEY (codProducto) REFERENCES producto (codProducto)
    );

CREATE TABLE 
    storage (
        url VARCHAR (100),
        fileName VARCHAR (100)
    );