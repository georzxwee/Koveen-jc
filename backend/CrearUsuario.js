const Usuario = require("./models/usuario");
const { nombreValido, correoValido, telefonoValido, claveValida } = require("./validaciones");

async function crearUsuario(req, res) {
  const { nombre, correo, telefono, clave } = req.body;

  if (!nombreValido(nombre)) return res.status(400).json({ error: "El nombre solo puede tener letras (mínimo 3)" });
  if (!correoValido(correo)) return res.status(400).json({ error: "El correo no es válido" });
  if (!telefonoValido(telefono)) return res.status(400).json({ error: "El teléfono debe tener 10 números y empezar por 3" });
  if (!claveValida(clave)) return res.status(400).json({ error: "La clave debe tener de 6 a 20 caracteres, con letras y números" });

  const email = correo.toLowerCase();
  if (await Usuario.findOne({ correo: email })) return res.status(400).json({ error: "Ese correo ya está registrado" });

  const usuario = await Usuario.create({ nombre: nombre.trim(), correo: email, telefono, clave, rol: "cliente" });
  res.json({ nombre: usuario.nombre, correo: usuario.correo, telefono: usuario.telefono, rol: usuario.rol });
}

module.exports = crearUsuario;