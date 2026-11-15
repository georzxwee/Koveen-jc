import { useState, useEffect } from "react";
import { API } from "./configuracion";
import { agregarAlCarrito, cambiarCantidad, contarProductos } from "./descuentos";
import Encabezado from "./componentes/Encabezado";
import Tienda from "./componentes/Tienda";
import Carrito from "./componentes/Carrito";
import Contacto from "./componentes/Contacto";
import Footer from "./componentes/Footer";

function App() {
  const [pagina, setPagina] = useState("tienda");
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  useEffect(() => {
    fetch(API + "/api/productos")
      .then((respuesta) => respuesta.json())
      .then((datos) => setProductos(datos))
      .catch(() => alert("No se pudo conectar con el servidor"));
  }, []);

  function ir(e, destino, seccion) {
    e.preventDefault();
    setPagina(destino);
    window.scrollTo(0, 0);
    if (seccion) setTimeout(() => document.getElementById(seccion).scrollIntoView(), 50);
  }

  return (
    <>
      <Encabezado ir={ir} total={contarProductos(carrito)} abrirCarrito={() => setCarritoAbierto(true)} />

      {pagina === "tienda" && <Tienda productos={productos} agregar={(p) => setCarrito(agregarAlCarrito(carrito, p))} />}
      {pagina === "contacto" && <Contacto />}

      <Footer />

      {carritoAbierto && (
        <Carrito
          carrito={carrito}
          cambiar={(id, cambio) => setCarrito(cambiarCantidad(carrito, id, cambio))}
          vaciar={() => setCarrito([])}
          cerrar={() => setCarritoAbierto(false)}
        />
      )}
    </>
  );
}

export default App;