const Usuario = require("./models/usuario");
const { correoValido } = require("./validaciones");

async function iniciarSesion(req, res) {
  const { correo, clave } = req.body;

  if (!correoValido(correo) || typeof clave !== "string") return res.status(400).json({ error: "Escribe un correo y una clave válidos" });

  const usuario = await Usuario.findOne({ correo: correo.toLowerCase(), clave });
  if (!usuario) return res.status(401).json({ error: "Correo o clave incorrectos" });

  res.json({ nombre: usuario.nombre, correo: usuario.correo, telefono: usuario.telefono, rol: usuario.rol });
}

module.exports = iniciarSesion;