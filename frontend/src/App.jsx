import { useState, useEffect } from "react";
import { API } from "./configuracion";
import { agregarAlCarrito, cambiarCantidad, contarProductos } from "./descuentos";
import Encabezado from "./componentes/Encabezado";
import Tienda from "./componentes/Tienda";
import Carrito from "./componentes/Carrito";
import Contacto from "./componentes/Contacto";
import Login from "./componentes/Login";
import Registro from "./componentes/Registro";
import MiCuenta from "./componentes/MiCuenta";
import Admin from "./componentes/Admin";
import Footer from "./componentes/Footer";

function App() {
  const [pagina, setPagina] = useState("tienda");
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetch(API + "/api/productos")
      .then((respuesta) => respuesta.json())
      .then((datos) => setProductos(datos))
      .catch(() => alert("No se pudo conectar con el servidor"));
  }, []);

  useEffect(() => {
    if (usuario === null || pagina !== "cuenta") return;
    const cabeceras = { correo: usuario.correo, clave: usuario.clave };
    const admin = usuario.rol === "admin";

    fetch(API + (admin ? "/api/pedidos" : "/api/mis-pedidos"), { headers: cabeceras }).then((r) => r.json()).then((datos) => setPedidos(datos));
    if (admin) fetch(API + "/api/mensajes", { headers: cabeceras }).then((r) => r.json()).then((datos) => setMensajes(datos));
  }, [usuario, pagina]);

  function ir(e, destino, seccion) {
    e.preventDefault();
    setPagina(destino);
    window.scrollTo(0, 0);
    if (seccion) setTimeout(() => document.getElementById(seccion).scrollIntoView(), 50);
  }

  function entrar(datos) {
    setUsuario(datos);
    setPagina("cuenta");
  }

  function salir(e) {
    e.preventDefault();
    setUsuario(null);
    setPedidos([]);
    setMensajes([]);
    setPagina("tienda");
  }

  return (
    <>
      <Encabezado ir={ir} usuario={usuario} salir={salir} total={contarProductos(carrito)} abrirCarrito={() => setCarritoAbierto(true)} />

      {pagina === "tienda" && <Tienda productos={productos} agregar={(p) => setCarrito(agregarAlCarrito(carrito, p))} />}
      {pagina === "contacto" && <Contacto />}
      {pagina === "login" && <Login entrar={entrar} />}
      {pagina === "registro" && <Registro entrar={entrar} />}
      {pagina === "cuenta" && usuario !== null && usuario.rol === "admin" && (
        <Admin usuario={usuario} productos={productos} setProductos={setProductos} mensajes={mensajes} pedidos={pedidos} />
      )}
      {pagina === "cuenta" && usuario !== null && usuario.rol !== "admin" && <MiCuenta usuario={usuario} pedidos={pedidos} />}

      <Footer />

      {carritoAbierto && (
        <Carrito
          carrito={carrito}
          usuario={usuario}
          cambiar={(id, cambio) => setCarrito(cambiarCantidad(carrito, id, cambio))}
          vaciar={() => setCarrito([])}
          cerrar={() => setCarritoAbierto(false)}
        />
      )}
    </>
  );
}

export default App;