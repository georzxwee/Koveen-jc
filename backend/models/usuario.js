const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  correo: { type: String, unique: true },
  telefono: String,
  clave: String,
  rol: { type: String, default: "cliente" },
});

module.exports = mongoose.model("Usuario", usuarioSchema);