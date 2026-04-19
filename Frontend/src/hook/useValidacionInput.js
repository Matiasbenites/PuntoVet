



export const comprobarNumero = (num) => {
    const regex = /^\d*\.?\d{0,2}$/;
    return regex.test(num)
}