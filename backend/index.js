const express = require("express");
const mongoose = require("mongoose");

const Producto = require("./models/producto");
const Usuario = require("./models/usuario");
const Mensaje = require("./models/mensaje");
const Pedido = require("./models/pedido");

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

// "Portero": solo deja pasar si el correo y la clave son de un usuario guardado
async function soloAdmin(req, res, next) {
  const admin = await Usuario.findOne({ correo: req.headers.correo, clave: req.headers.clave });
  if (!admin) return res.status(401).json({ error: "No autorizado" });
  next();
}

// ---------- LOGIN ----------
app.post("/api/login", async (req, res) => {
  const admin = await Usuario.findOne({ correo: req.body.correo, clave: req.body.clave });
  if (!admin) return res.status(401).json({ error: "Correo o clave incorrectos" });
  res.json({ ok: true });
});



// ---------- PRODUCTOS ----------
app.get("/api/productos", async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

app.post("/api/productos", soloAdmin, async (req, res) => {
  const producto = await Producto.create(req.body);
  res.json(producto);
});

app.delete("/api/productos/:id", soloAdmin, async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});


// ---------- MENSAJES (formulario de contacto) ----------
app.post("/api/mensajes", async (req, res) => {
  const mensaje = await Mensaje.create(req.body);
  res.json(mensaje);
});

app.get("/api/mensajes", soloAdmin, async (req, res) => {
  const mensajes = await Mensaje.find();
  res.json(mensajes);
});


// ---------- PEDIDOS (formulario del carrito) ----------
app.post("/api/pedidos", async (req, res) => {
  const pedido = await Pedido.create(req.body);
  res.json(pedido);
});

app.get("/api/pedidos", soloAdmin, async (req, res) => {
  const pedidos = await Pedido.find();
  res.json(pedidos);
});

app.get("/", (req, res) => res.send("Servidor de Koveen funcionando"));



// ---------- CONEXIÓN A MONGODB ----------
const url = "mongodb+srv://georgediaztorres:Lady2012MJ@cluster0.eilffuy.mongodb.net/";

mongoose
  .connect(url)
  .then(async () => {
    console.log("Conectado a MongoDB");

        // Si no hay ningún usuario, crea el administrador solo una vez, para no hacerlo manual pues
    const cuantosUsuarios = await Usuario.countDocuments();
    if (cuantosUsuarios === 0) {
      await Usuario.create({ correo: "admin@koveen.com", clave: "koveen123" });
      console.log("Administrador creado: admin@koveen.com / koveen123");
    }

    const PUERTO = process.env.PORT || 3000;
    app.listen(PUERTO, () => console.log("Servidor en el puerto " + PUERTO));
  })
  .catch((error) => console.log("Error al conectar:", error.message));