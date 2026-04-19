
// const { producto } = useSelector (state => state.productos)
// const { nombre, descripcion, categoria, stock, unidades, tamanio, mililitros, mascota, edad, imagen, precioContado, precioLista, precioSuelto } = producto;


export const valoresCard = (codCategoria, codMascotas, codEdades, codTamanio) => {
    let c = '';
    let m = [];
    let e = [];
    let t = '';

    console.log('mascotas: ', codMascotas, 'edades: ', codEdades);
    switch (codCategoria) {
        case 1: c = 'Balanceado'; break;
        case 2: c = 'Juguete'; break;
        case 3: c = 'Medicamento'; break;
        case 4: c = 'Accesorio'; break;
        case 5: c = 'Otros'; break;
    }

    switch (codTamanio) {
        case 1: t = 'Grande'; break;
        case 2: t = 'Mediano'; break;
        case 3: t = 'Chico'; break;
    }

    if (codMascotas) {
        m = codMascotas.map((mascota) => {
            const mascotaNum = parseInt(mascota, 10); // Convertir la cadena a número
            switch (mascotaNum) {
                case 1: return 'Perro';
                case 2: return 'Gato';
                case 3: return 'Ave';
                case 4: return 'Otros';
                default: return 'no entra';
            }
        }).join(' - ');
    }

    if (codEdades) {
        e = codEdades.map((edad) => {
            const edadNum = parseInt(edad, 10);
            switch (edadNum) {
                case 1: return 'Cachorro';
                case 2: return 'Castrado';
                case 3: return 'Joven';
                case 4: return 'Adulto';
                case 5: return 'Mayor';
                case 6: return 'Urinario';
                default: return 'no entra';
            }
        }).join(' - ');
    }


    return [c, m, e, t];
}
