const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Producto = require("./models/producto");
const Mensaje = require("./models/mensaje");
const Pedido = require("./models/pedido");
const Usuario = require("./models/usuario");
const crearUsuario = require("./CrearUsuario");
const iniciarSesion = require("./IniciarSesion");

const app = express();
app.use(cors());
app.use(express.json());

async function usuarioDeLaPeticion(req) {
  const { correo, clave } = req.headers;
  if (!correo || !clave) return null;
  return await Usuario.findOne({ correo, clave });
}

async function soloUsuario(req, res, next) {
  const usuario = await usuarioDeLaPeticion(req);
  if (!usuario) return res.status(401).json({ error: "Debes iniciar sesión" });
  req.usuario = usuario;
  next();
}

async function soloAdmin(req, res, next) {
  const usuario = await usuarioDeLaPeticion(req);
  if (!usuario || usuario.rol !== "admin") return res.status(401).json({ error: "No autorizado" });
  next();
}

app.post("/api/registro", crearUsuario);
app.post("/api/login", iniciarSesion);

app.get("/api/productos", async (req, res) => res.json(await Producto.find()));
app.post("/api/productos", soloAdmin, async (req, res) => res.json(await Producto.create(req.body)));
app.delete("/api/productos/:id", soloAdmin, async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

app.post("/api/mensajes", async (req, res) => res.json(await Mensaje.create(req.body)));
app.get("/api/mensajes", soloAdmin, async (req, res) => res.json(await Mensaje.find()));

app.post("/api/pedidos", async (req, res) => {
  const usuario = await usuarioDeLaPeticion(req);
  const { numero, nombre, telefono, direccion, productos, total } = req.body;
  res.json(await Pedido.create({ numero, nombre, telefono, direccion, productos, total, correo: usuario ? usuario.correo : "" }));
});
app.get("/api/pedidos", soloAdmin, async (req, res) => res.json(await Pedido.find()));
app.get("/api/mis-pedidos", soloUsuario, async (req, res) => res.json(await Pedido.find({ correo: req.usuario.correo })));

const url = "mongodb+srv://georgediaztorres:Lady2012MJ@cluster0.eilffuy.mongodb.net/";

mongoose
  .connect(url)
  .then(async () => {
    console.log("Conectado a MongoDB");

    if (!(await Usuario.findOne({ rol: "admin" }))) {
      await Usuario.create({ nombre: "Administrador", correo: "admin@koveen.com", telefono: "3000000000", clave: "koveen123", rol: "admin" });
      console.log("Administrador creado: admin@koveen.com / koveen123");
    }

    const PUERTO = process.env.PORT || 3000;
    app.listen(PUERTO, () => console.log("Servidor en el puerto " + PUERTO));
  })
  .catch((error) => console.log("Error al conectar:", error.message));