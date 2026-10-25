const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
    numero: Number,
    nombre: String,
    telefono: String,
    direccion: String,
    productos: String,
    total: Number,
});

module.exports = mongoose.model("Pedido", pedidoSchema);