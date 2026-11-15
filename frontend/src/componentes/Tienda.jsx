import { formatoCOP } from "../descuentos";

const secciones = [
  { id: "ropa", titulo: "Ropa" },
  { id: "accesorios", titulo: "Accesorios" },
  { id: "calzado", titulo: "Calzado" },
];

function Tienda(props) {
  return (
    <div>
      <section className="principal" id="inicio">
        <h1>Koveen</h1>
        <h2>Moda consciente,<br />hecha para durar</h2>
        <p>Ropa y accesorios sostenibles diseñados para Latinoamérica. Materiales responsables, lineas atemporales, cero excusas con el planeta.</p>
      </section>

      <main>
        {secciones.map((seccion) => {
          const lista = props.productos.filter((p) => p.categoria === seccion.id);
          return (
            <section className="catalogo" id={seccion.id} key={seccion.id}>
              <h2>{seccion.titulo}</h2>
              {lista.length === 0 && <p className="vacio">Aún no hay productos en esta sección.</p>}
              <div className="contenedor">
                {lista.map((producto, posicion) => (
                  <article className="caja" key={producto._id}>
                    <span className="numero">N. {String(posicion + 1).padStart(3, "0")}</span>
                    <img src={producto.imagen} alt={producto.nombre} />
                    <div className="detalle">
                      <span className="etiqueta">{producto.etiqueta}</span>
                      <h3>{producto.nombre}</h3>
                      <span className="precio">{formatoCOP(producto.precio)}</span>
                      <button className="boton" onClick={() => props.agregar(producto)}>Comprar</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

export default Tienda;