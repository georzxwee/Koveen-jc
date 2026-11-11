const nombreValido = (nombre) => typeof nombre === "string" && /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]{3,40}$/.test(nombre.trim());
const correoValido = (correo) => typeof correo === "string" && correo.length <= 50 && /^[^ @]+@[^ @]+\.[^ @]+$/.test(correo);
const telefonoValido = (telefono) => typeof telefono === "string" && /^3[0-9]{9}$/.test(telefono);
const claveValida = (clave) =>
  typeof clave === "string" && clave.length >= 6 && clave.length <= 20 && !clave.includes(" ") && /[a-zA-Z]/.test(clave) && /[0-9]/.test(clave);

module.exports = { nombreValido, correoValido, telefonoValido, claveValida };