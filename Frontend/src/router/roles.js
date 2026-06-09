// Control de acceso por rol | RF: Gestión de usuarios con perfiles diferenciados
// ADMINISTRADOR: acceso total (productos, compras, ventas, usuarios)
// VENDEDOR: acceso solo a ventas y consulta de productos (read-only)
export const ROLES = {
    ADMINISTRADOR: 1,
    VENDEDOR: 2
};

export const getCodTipoUsuario = (usuario = {}) => {
    const tipoUsuarioTexto = (
        usuario.tipoUsuario?.tipoUsuario ||
        usuario.dataValues?.tipoUsuario?.tipoUsuario ||
        usuario._previousDataValues?.tipoUsuario?.tipoUsuario ||
        ''
    ).toLowerCase();

    if (tipoUsuarioTexto.includes('administrador')) return ROLES.ADMINISTRADOR;
    if (tipoUsuarioTexto.includes('vendedor')) return ROLES.VENDEDOR;

    return Number(
        usuario.codTipoUsuario ||
        usuario.dataValues?.codTipoUsuario ||
        usuario._previousDataValues?.codTipoUsuario ||
        usuario.tipoUsuario?.codTipoUsuario ||
        usuario.dataValues?.tipoUsuario?.codTipoUsuario ||
        usuario._previousDataValues?.tipoUsuario?.codTipoUsuario ||
        0
    );
};

export const getRutaInicioPorRol = (usuario = {}) => {
    const codTipoUsuario = getCodTipoUsuario(usuario);
    return codTipoUsuario === ROLES.VENDEDOR ? '/ventas' : '/productos';
};

export const usuarioTieneRol = (usuario = {}, rolesPermitidos = []) => {
    const codTipoUsuario = getCodTipoUsuario(usuario);
    return rolesPermitidos.includes(codTipoUsuario);
};
