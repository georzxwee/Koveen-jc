import { useState } from "react";

const enlaces = [
  ["Inicio", "tienda", "inicio"],
  ["Ropa", "tienda", "ropa"],
  ["Accesorios", "tienda", "accesorios"],
  ["Calzado", "tienda", "calzado"],
  ["Contacto", "contacto"],
];

function Encabezado(props) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cuenta = props.usuario === null ? [["Iniciar sesión", "login"], ["Registrarse", "registro"]] : [["Mi cuenta", "cuenta"]];

  const manejarClick = (e, pagina, seccion) => {
    setMenuAbierto(false);
    props.ir(e, pagina, seccion);
  };

  const manejarSalir = (e) => {
    setMenuAbierto(false);
    props.salir(e);
  };

  return (
    <header className="encabezado">
      <a href="#inicio" onClick={(e) => props.ir(e, "tienda", "inicio")}>
        <img src="images/logos/logo.png" alt="Koveen" className="logo" />
      </a>
      <button 
        className="boton-hamburguesa" 
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Menú"
      >
        {menuAbierto ? "✕" : "☰"}
      </button>
      <nav className={`nav-menu ${menuAbierto ? "abierto" : ""}`}>
        <ul>
          {[...enlaces, ...cuenta].map(([texto, pagina, seccion]) => (
            <li key={texto}><a href="#" onClick={(e) => manejarClick(e, pagina, seccion)}>{texto}</a></li>
          ))}
          {props.usuario !== null && <li><a href="#" onClick={manejarSalir}>Cerrar sesión</a></li>}
        </ul>
      </nav>
      <button className="boton-carrito" onClick={props.abrirCarrito}>Carrito <span id="contador">{props.total}</span></button>
    </header>
  );
}

export default Encabezado;