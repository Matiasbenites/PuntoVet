import { createSlice } from "@reduxjs/toolkit";

const getSoredUser = () => {
    const usuario = localStorage.getItem('user');
    return usuario ? JSON.parse(usuario) : null;
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        usuario: getSoredUser() || {},
        isLoading: false,
        token: '',
        isAutenticated: !!getSoredUser()
    },
    reducers: {
        loadingAuth: (state) => {
            state.isLoading = true
        },
        setAuth: (state, action) => {
            state.isLoading = false;
            state.usuario = action.payload.usuario;
            state.isAutenticated = true;
        },
        authLogout: (state) => {
            state.usuario = {}
            state.token = ''
            state.isAutenticated = false
        }

    }
});

export const { loadingAuth, setAuth, authLogout } = authSlice.actions;