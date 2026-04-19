import axios from "axios";



export const usuariosApi = axios.create({
    baseURL: 'http://localhost:4000'
});

export const getUsuarios = async (estado) => {
    try {
        const { data } = await usuariosApi.get(`/usuarios?estado=${estado}`);
        return data;
    } catch (error) {
        return error;
    }
}

export const getUsuario = async (codUsuario) => {
    try {
        const { data } = await usuariosApi.get(`/usuarios/${codUsuario}`);
        return data;
    } catch (error) {
        return error;
    }
}

export const updateUsuario = async (usuario, codUsuario) => {
    delete usuario.codUsuario;
    // console.log('Usuario a actualizar: ', usuario, 'CodUsuario: ', codUsuario);
    try {
        const { data } = await usuariosApi.put(`/usuarios/${codUsuario}`, usuario);
        console.log(data);
        return data;
    } catch (error) {
        return error;
    }
}

export const setUsuario = async (usuario) => {
    try {
        const { data } = await usuariosApi.post('/usuarios', usuario);
        return data;
    } catch (error) {
        return error;
    }
}

export const deleteUsuario = async (codUsuario) => {
    try {
        const { data } = await usuariosApi.delete(`/usuarios/${codUsuario}`);
        return data;
    } catch (error) {
        return error;
    }
}

export const login = async (usuario) => {
    try {
        const responce = await usuariosApi.post('/usuarios/login', usuario);
        //console.log(responce);
        return responce;
    } catch (error) {
        const { response } = error;
        return response;
    }
}
