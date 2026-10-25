const express = require("express");
const mongoose = require("mongoose");

const Producto = require("./models/producto");

const app = express();
app.use(express.json());

// Permiso para que React pueda hablar con este servidor
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, correo, clave");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ---------- PRODUCTOS ----------
app.get("/api/productos", async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

app.get("/", (req, res) => res.send("Servidor de Koveen funcionando"));

// ---------- CONEXIÓN A MONGODB ----------
const url = "mongodb+srv://georgediaztorres:Lady2012MJ@cluster0.eilffuy.mongodb.net/";

mongoose
  .connect(url)
  .then(async () => {
    console.log("Conectado a MongoDB");

const cuantos = await Producto.countDocuments();
    if (cuantos === 0) {
      await Producto.insertMany([
        { nombre: "Camiseta Basica", precio: 75000, categoria: "ropa", etiqueta: "Algodón Organico", imagen: "../frontend/public/images/productos/001.jpg" },
        { nombre: "Pantalon Basico", precio: 100000, categoria: "ropa", etiqueta: "Lino Organico", imagen: "images/productos/002.jpg" },
        { nombre: "Buzo Basico", precio: 135000, categoria: "ropa", etiqueta: "Algodón y Lino Organico", imagen: "images/productos/003.jpg" },
        { nombre: "Buzo Basico 2", precio: 150000, categoria: "ropa", etiqueta: "Algodón y Lino Organico", imagen: "images/productos/004.jpg" },
        { nombre: "Vestido Basico", precio: 200000, categoria: "ropa", etiqueta: "Algodón y Lino Organico", imagen: "images/productos/005.jpg" },
        { nombre: "Accesorio Basico 1", precio: 40000, categoria: "accesorios", etiqueta: "Materiales reciclados", imagen: "images/productos/001.jpg" },
        { nombre: "Accesorio Basico 2", precio: 55000, categoria: "accesorios", etiqueta: "Materiales reciclados", imagen: "images/productos/002.jpg" },
        { nombre: "Calzado Basico 1", precio: 180000, categoria: "calzado", etiqueta: "Fibras naturales", imagen: "images/productos/003.jpg" },
        { nombre: "Calzado Basico 2", precio: 210000, categoria: "calzado", etiqueta: "Fibras naturales", imagen: "images/productos/004.jpg" },
      ]);
      console.log("Productos de ejemplo creados");
    }

    const PUERTO = process.env.PORT || 3000;
    app.listen(PUERTO, () => console.log("Servidor en el puerto " + PUERTO));
  })
  .catch((error) => console.log("Error al conectar:", error.message));