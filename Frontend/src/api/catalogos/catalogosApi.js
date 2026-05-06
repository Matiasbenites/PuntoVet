export const getCategoria = async () => {
    return [
        { codCategoria: 1, nombreCategoria: 'Balanceados' },
        { codCategoria: 2, nombreCategoria: 'Juguetes' },
        { codCategoria: 3, nombreCategoria: 'Medicamentos' },
        { codCategoria: 4, nombreCategoria: 'Accesorios' },
        { codCategoria: 5, nombreCategoria: 'Otros' }
    ];
};

export const getTamanio = async () => {
    return [
        { codTamanio: 1, nombreTamanio: 'Chico' },
        { codTamanio: 2, nombreTamanio: 'Mediano' },
        { codTamanio: 3, nombreTamanio: 'Grande' }
    ];
};

export const getMascotas = async () => {
    return [
        { codMascota: 1, nombreMascota: 'Perro' },
        { codMascota: 2, nombreMascota: 'Gato' },
        { codMascota: 3, nombreMascota: 'Ave' },
        { codMascota: 4, nombreMascota: 'Otros' }
    ];
};

export const getEdades = async () => {
    return [
        { codEdad: 1, nombreEdad: 'Cachorro' },
        { codEdad: 2, nombreEdad: 'Castrado' },
        { codEdad: 3, nombreEdad: 'Joven' },
        { codEdad: 4, nombreEdad: 'Adulto' },
        { codEdad: 5, nombreEdad: 'Mayor' },
        { codEdad: 6, nombreEdad: 'Urinario' }
    ];
};
