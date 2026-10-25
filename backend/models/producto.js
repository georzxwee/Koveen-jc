const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    categoria: String, // ropa, accesorios o calzado
    etiqueta: String, // el material: "Algodón Organico"
    imagen: String,
});

module.exports = mongoose.model ("Producto", productoSchema);
