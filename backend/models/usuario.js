const mongoose = require ("mongoose");

const usuarioSchema = new mongoose.Schema({
    correo: String,
    clave: String,
});

module.exports = mongoose.model("Usuario", usuarioSchema);