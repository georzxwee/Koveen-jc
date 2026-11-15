import { formatoCOP } from "../descuentos";

function MiCuenta(props) {
  return (
    <main className="pagina">
      <h2>Mi cuenta</h2>
      <div className="tarjeta">
        <strong>{props.usuario.nombre}</strong>
        <p>{props.usuario.correo}</p>
        <p>Teléfono: {props.usuario.telefono}</p>
      </div>

      <h3>Mis pedidos ({props.pedidos.length})</h3>
      {props.pedidos.length === 0 && <p className="vacio">Todavía no has hecho pedidos.</p>}
      {props.pedidos.map((p) => (
        <div className="tarjeta" key={p._id}>
          <strong>Pedido #{p.numero}</strong>
          <p>{p.productos}</p>
          <p><strong>Total: {formatoCOP(p.total)}</strong></p>
        </div>
      ))}
    </main>
  );
}

export default MiCuenta;