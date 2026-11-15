import { useState } from "react";
import { contarProductos } from "./descuentos";
import Encabezado from "./componentes/Encabezado";
import Footer from "./componentes/Footer";

function App() {
  const [pagina, setPagina] = useState("tienda");
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  function ir(e, destino, seccion) {
    e.preventDefault();
    setPagina(destino);
    window.scrollTo(0, 0);
    if (seccion) setTimeout(() => document.getElementById(seccion).scrollIntoView(), 50);
  }

  return (
    <>
      <Encabezado ir={ir} total={contarProductos(carrito)} abrirCarrito={() => setCarritoAbierto(true)} />
      <Footer />
    </>
  );
}

export default App;