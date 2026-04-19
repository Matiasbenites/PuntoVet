

export const validacionesUsuario = {
    nombre: {
        required: { value: true, message: 'Es requerido' },
        maxLength: { value: 100, message: 'Debe ser mayor a 100 caracteres' },
        minLength: { value: 3, message: 'Debe contener al menos 3 caracteres' }
    },

    celular: {
        required: { value: true, message: 'Es requerido' },
        minLength: { value: 6, message: 'Debe contener al menos 6 numeros' },
        pattern: {
            value: /^[0-9]+$/,
            message: 'Ingrese un número válido'
        },
    },

    usuario: {
        required: { value: true, message: 'Es requerido' },
        minLength: { value: 3, message: 'Debe contener al menos 3 caracteres' },
        maxLength: { value: 20, message: 'Debe tener menos de 10 caracteres' }
    },

    password: {
        required: { value: true, message: 'Es requerido' },
        minLength: { value: 4, message: 'Debe contener al menos 4 caracteres' },
        maxLength: { value: 12, message: 'Debe tener menos de 12 caracteres' },
        validate: {
            hasSpecialChar: value => {
                return /[\W_]/.test(value) || 'Debe contener al menos un carácter especial';
            }
        }
    },

    passwordConfirm: {
        required: { value: true, message: 'Es requerido' },
    }

};