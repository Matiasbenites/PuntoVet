





export const validacion = {
    nombre: {
        required: { value: true, message: 'Es requerido' },
        maxLength: { value: 100, message: 'Debe ser mayor a 100 caracteres' },
        minLength: { value: 3, message: 'Debe contener al menos 3 caracteres' }
    },
    descripcion: {
        required: { value: true, message: 'Es requerido' },
        maxLength: { value: 300, message: 'Maximo 300 caracteres' },
        minLength: { value: 10, message: 'Minimo 10 caracteres' }
    },
    peso: {
        pattern: { value: /^\d+(\.\d+)?$/, message: 'Ingrese un número válido' }
    },
    mililitros: {
        pattern: { value: /^[0-9]+$/, message: 'Ingrese un número válido' }
    },
    unidades: {
        pattern: { value: /^[0-9]+$/, message: 'Ingrese un número válido' }
    },
    tamanio: {
        seleccionValida: (value) => {
            if (!value) return 'Seleccione una opcion'
            if (isNaN(parseInt(value, 10))) return 'Seleccione una opcion valida';
            return true;
        },
    },
    categoria: {
        seleccionValida: (value) => {
            if (!value) return 'Seleccione una opcion'
            if (isNaN(parseInt(value, 10))) return 'Seleccione una opcion valida';
            return true;
        },
        required: { value: true, message: 'Debe seleccionar una opcion' }
    },
    stock: {
        required: { value: true, message: 'Ingrese el stock' },
        pattern: { value: /^[0-9]+$/, message: 'Ingrese un número válido' },
        maxLength: { value: 3, message: 'Maximo 999' },
    },
    imagen: {
        require: { value: true, message: 'Debe seleccionar una imagen' },
        validate: {
            formatoValido: (value) => {
                if (!value[0]) return 'Por favor, carga una imagen.';
                const file = value[0];
                const extension = file.name.split('.').pop().toLowerCase();
                if (!(extension === 'png' || extension === 'jpeg' || extension === 'jpg')) {
                    return 'Por favor, carga una imagen PNG, JPEG o JPG.';
                }
                return true;
            }
        }
    }

};