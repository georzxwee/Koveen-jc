const enlaces = [
  ["Inicio", "tienda", "inicio"],
  ["Ropa", "tienda", "ropa"],
  ["Accesorios", "tienda", "accesorios"],
  ["Calzado", "tienda", "calzado"],
  ["Contacto", "contacto"],
];

function Encabezado(props) {
  return (
    <header className="encabezado">
      <a href="#inicio" onClick={(e) => props.ir(e, "tienda", "inicio")}>
        <img src="images/logos/logo.png" alt="Koveen" className="logo" />
      </a>
      <nav>
        <ul>
          {enlaces.map(([texto, pagina, seccion]) => (
            <li key={texto}><a href="#" onClick={(e) => props.ir(e, pagina, seccion)}>{texto}</a></li>
          ))}
        </ul>
      </nav>
      <button className="boton-carrito" onClick={props.abrirCarrito}>Carrito <span id="contador">{props.total}</span></button>
    </header>
  );
}

export default Encabezado;