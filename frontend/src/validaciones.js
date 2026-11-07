export const soloLetras = (texto) => texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]/g, "");
export const soloNumeros = (texto) => texto.replace(/[^0-9]/g, "");
export const sinEspacios = (texto) => texto.replace(/ /g, "");
export const nombreValido = (nombre) => nombre.trim().length >= 3;
export const correoValido = (correo) => /^[^ @]+@[^ @]+\.[^ @]+$/.test(correo);
export const telefonoValido = (telefono) => telefono.length === 10 && telefono[0] === "3";
export const claveValida = (clave) => clave.length >= 6 && clave.length <= 20 && /[a-zA-Z]/.test(clave) && /[0-9]/.test(clave);