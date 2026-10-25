const mongoose = require("mongoose");

const mensajeSchema = new mongoose.Schema ({
    nombre: String,
    correo: String,
    mensaje: String,
});

module.exports = mongoose.model("Mensaje", mensajeSchema);