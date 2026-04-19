USE punto_vet;

SET sql_safe_updates = 1;

INSERT INTO categoria (nombreCategoria)
	VALUES("Alimento"), ("Juguete"), ("Medicamento"), ("Accesorio"), ("Otro");
    
INSERT INTO edad (nombreEdad)
	VALUES("Cachorro"), ("Castrado"), ("Joven"), ("Adulto"), ("Mayor"),  ("Urinario");

INSERT INTO mascota (nombreMascota)
	VALUES("Perro"), ("Gato"), ("Ave"), ("Otro");

INSERT INTO tamanio (nombreTamanio)
	VALUES("Chico"), ("Mediano"), ("Grande");

INSERT INTO tipo_pago (nombreTipoPago)
	VALUES("Efectivo"), ("Débito/Transferencia"), ("Tarjeta Crédito");

INSERT INTO tipo_usuario (tipoUsuario)
	VALUES("Administrador"), ("Vendedor");

INSERT INTO usuario (nombreApellido, celular, password, codTipoUsuario, user)
	VALUES
		("Nahuel Aguirre", "+54 9 3794 61-2713", "pass1234.", 1, "Nano"), 
		("Matias Benites", "+54 9 3794 40-9720", "pass1234.", 1, "Matute");

INSERT INTO producto (codCategoria, nombre, descripcion, peso, stock, precioContado, precioLista, precioSuelto)
    VALUES
        (1, "Pedigree p/perro cachorro", "Alimento balanceado", 21, 20, "18410.00", "25774.00", "1550.00"),
		(1, "Pedigree p/perro adulto", "Alimento balanceado", 15, 20, "13600.00", "19040.00", "1750.00"),
		(1, "Whiskas p/gatos castrados", "Alimento balanceado", 10, 20, "15040.00", "21056.00", "2470.00"),
		(1, "Sabrositos p/gatos mix", "Alimento balanceado", 20, 20, "11910.00", "16674.00", "1230.00"),
		(1, "Sabrositos p/perro adulto", "Alimento balanceado", 15, 20, "6240.00", "8736.00", "800.00"),
		(1, "Whiskas Buenos por naturaleza", "Alimento balanceado", 10, 20, "15040.00", "21056.00", "2230.00"),
		(1, "Dog Selection Etiqueta negra p/cachorro", "Alimento balanceado", 15, 20, "15630.00", "21882.00", "1800.00"),
		(1, "Dog Selection Etiqueta Negra p/adulto", "Alimento balanceado", 21, 20, "21470.00", "30058.00", "1930.00"),
		(1, "Tiernitos p/cachorro", "Alimento balanceado", 15, 20, "8100.00", "11340.00", "750.00"),
		(1, "Tiernitos p/gato", "Alimento balanceado", 10, 20, "7650.00", "10710.00", "1350.00"),
		(1, "Raza p/perro adulto Carne", "Alimento balanceado", 21, 20, "10650.00", "14910.00", "910.00"),
		(1, "Raza p/gato cachorro pescado", "Alimento balanceado", 10, 20, "7720.00", "10808.00", "1300.00"),
		(1, "Raza p/gato adulto leche y pollo", "Alimento balanceado", 10, 20, "7720.00", "10808.00", "1300.00"),
		(1, "Pro Plan Puppy p/perro Raza pequeÃ±a", "Alimento balanceado", 7.5, 20, "25120.00", "35168.00", "5000.00"),
		(1, "Pro Plan Puppy p/perro Raza mediana", "Alimento balanceado", 15, 20, "39570.00", "55398.00", "4300.00"),
		(1, "Pro Plan Gato p/gato adulto", "Alimento balanceado", 15, 20, "56710.00", "79394.00", "6250.00"),
		(1, "Dog Selection Etiqueta Negra Cachorro", "Alimento balanceado", 10, 20, "100.00", "140.00", "10.00"),
		(1, "Dogui p/Cachorro", "Alimento balanceado", 15, 20, "12530.00", "17542.00", "1400.00"),
		(1, "Dogui p/Adulto", "Alimento balanceado", 15, 20, "11360.00", "15904.00", "1300.00"),
		(1, "Gati p/Gato Carne y Pollo", "Alimento balanceado", 15, 20, "14990.00", "20986.00", "1700.00"),
		(1, "Sieger Puppy p/Cachorro medium", "Alimento balanceado", 15, 20, "20950.00", "29330.00", "2500.00"),
		(1, "Sieger Senior p/Adulto reduced calorie", "Alimento balanceado", 12, 20, "16760.00", "23464.00", "2700.00"),
		(1, "Sieger Katze p/Gato Stress Control", "Alimento balanceado", 7.5, 20, "17180.00", "24052.00", "3800.00"),
		(1, "Pedigree p/perro senior", "Alimento balanceado", 8, 20, "7000.00", "9800.00", "1600.00"),
		(1, "Agility p/perro adulto", "Alimento balanceado", 20, 20, "15270.00", "21378.00", "1400.00"),
		(1, "Agility p/perro cachorro", "Alimento balanceado", 10, 20, "17610.00", "24654.00", "1560.00"),
		(1, "Agility cats kitten", "Alimento balanceado", 10, 20, "15610.00", "21854.00", "2430.00"),
		(1, "Agility cats adulto", "Alimento balanceado", 10, 20, "14420.00", "21188.00", "2400.00"),
		(1, "Maxxium p/perro cachorro", "Alimento balanceado", 20, 20, "15040.00", "21180.00", "1400.00"),
		(1, "Maxxium p/perro adulto", "Alimento balanceado", 20, 20, "19180.00", "26852.00", "1870.00"),
		(1, "Maxxium p/perro adulto sabor cordero", "Alimento balanceado", 15, 20, "19350.00", "27090.00", "1750.00"),
		(1, "Vital can premium p/perro cachorro", "Alimento balanceado", 20, 20, "11810.00", "16534.00", "1100.00"),
		(1, "Vital can premium p/perro adulto", "Alimento balanceado", 20, 20, "11810.00", "16534.00", "1300.00"),
		(1, "Belcan p/perro adulto Safety pack", "Alimento balanceado", 24, 20, "9150.00", "12810.00", "500.00"),
		(1, "Belcan p/perro junior", "Alimento balanceado", 15, 20, "5950.00", "8330.00", "750.00"),
		(1, "Belcat p/gato", "Alimento balanceado", 10, 20, "5950.00", "8330.00", "750.00"),
		(1, "Therapy canine cardiac health", "Alimento balanceado", 10, 20, "29160.00", "40824.00", "5000.00"),
		(1, "Therapy canine gastrointestinal", "Alimento balanceado", 10, 20, "24960.00", "34944.00", "8000.00"),
		(1, "Therapy feline gastrointestinal", "Alimento balanceado", 2, 20, "9520.00", "13328.00", "6250.00"),
		(1, "Therapy feline urinary health", "Alimento balanceado", 7.5, 20, "30510.00", "42714.00", "6500.00"),
		(1, "Balanced kitten", "Alimento balanceado", 7.5, 20, "21780.00", "30492.00", "4600.00"),
		(1, "Balanced p/gato adulto", "Alimento balanceado", 7.5, 20, "19720.00", "27608.00", "4250.00"),
		(1, "Balanced Puppy razas grandes (p/perro)", "Alimento balanceado", 20, 20, "32580.00", "45612.00", "2800.00"),
		(1, "Balanced Adultos razas medianas (p/perro)", "Alimento balanceado", 20, 20, "29790.00", "41706.00", "2500.00"),
		(1, "Nutrique large puppy (p/perro cachorro)", "Alimento balanceado", 15, 20, "40410.00", "56570.00", "4230.00"),
		(1, "Nutrique skin sensitivity dog", "Alimento balanceado", 15, 20, "39110.00", "54754.00", "3990.00");
	
INSERT INTO producto_edad (codProducto, codEdad) VALUES(2,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(5,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(8,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(11,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(13,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(16,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(19,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(22,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(25,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(28,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(30,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(31,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(33,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(34,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(42,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(44,4);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(1,1);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(7,1);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(9,1);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(12,1);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(17,1);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(18,1);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(21,1);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(26,1);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(29,1);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(32,1);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(45,1);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(3,2);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(22,5);
INSERT INTO producto_edad (codProducto, codEdad) VALUES(24,5);


INSERT INTO producto_mascota (codProducto, codMascota) VALUES(1,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(2,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(5,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(11,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(14,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(15,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(24,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(25,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(26,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(29,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(30,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(31,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(32,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(33,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(34,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(35,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(43,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(44,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(45,1);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(3,2);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(4,2);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(10,2);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(12,2);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(13,2);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(16,2);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(20,2);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(23,2);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(36,2);
INSERT INTO producto_mascota (codProducto, codMascota) VALUES(42,2);



/*
delete from producto;
SET SQL_SAFE_UPDATES = 1;
*/