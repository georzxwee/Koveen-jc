import { useState } from "react";
import { API } from "../configuracion";
import { calcularTotales, formatoCOP } from "../descuentos";
import { soloLetras, soloNumeros, telefonoValido } from "../validaciones";

function Carrito(props) {
  const [vista, setVista] = useState("carrito");
  const [cupon, setCupon] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [error, setError] = useState("");
  const [confirmacion, setConfirmacion] = useState("");

  const { subtotal, total } = calcularTotales(props.carrito, cupon);

  function irAlCheckout() {
    if (props.carrito.length === 0) return;
    if (props.usuario) {
      setNombre(props.usuario.nombre);
      setTelefono(props.usuario.telefono);
    }
    setError("");
    setVista("checkout");
  }

  async function confirmarPedido(e) {
    e.preventDefault();
    if (!telefonoValido(telefono)) return setError("El teléfono debe tener 10 números y empezar por 3");

    const numero = Math.floor(100000 + Math.random() * 900000);
    const productos = props.carrito.map((i) => i.nombre + " x" + i.cantidad + " - " + formatoCOP(i.precio * i.cantidad)).join("\n");
    const credenciales = props.usuario ? { correo: props.usuario.correo, clave: props.usuario.clave } : {};

    try {
      const respuesta = await fetch(API + "/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...credenciales },
        body: JSON.stringify({ numero, nombre, telefono, direccion, productos, total }),
      });
      if (!respuesta.ok) return setError("No se pudo enviar el pedido");
      setConfirmacion("Pedido #" + numero + " enviado. Te vamos a contactar al " + telefono + ".");
      props.vaciar();
      setCupon("");
      setVista("confirmacion");
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  }

  return (
    <div className="panel-carrito">
      <div className="carrito-fondo" onClick={props.cerrar}></div>
      <div className="carrito-caja">
        <button className="cerrar" onClick={props.cerrar}>&times;</button>

        {vista === "carrito" && (
          <div>
            <h2>Tu Carrito</h2>
            {props.carrito.length === 0 && <p className="vacio">Tu carrito está vacío.</p>}
            {props.carrito.map((item) => (
              <div className="item-carrito" key={item._id}>
                <div>{item.nombre}<br /><small>{formatoCOP(item.precio)} c/u</small></div>
                <div className="cantidad">
                  <button onClick={() => props.cambiar(item._id, -1)}>&minus;</button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => props.cambiar(item._id, 1)}>+</button>
                </div>
                <strong>{formatoCOP(item.precio * item.cantidad)}</strong>
              </div>
            ))}

            <input placeholder="Codigo de descuento" value={cupon} onChange={(e) => setCupon(e.target.value)} style={{ marginTop: 18 }} />
            <div className="resumen">
              <p><span>Subtotal</span><span>{formatoCOP(subtotal)}</span></p>
              {subtotal > total && <p><span>Descuento</span><span>- {formatoCOP(subtotal - total)}</span></p>}
            </div>
            <p className="total"><span>Total</span><span>{formatoCOP(total)}</span></p>
            <button className="boton" onClick={irAlCheckout}>Finalizar Compra</button>
          </div>
        )}

        {vista === "checkout" && (
          <form onSubmit={confirmarPedido}>
            <h2>Datos de Envío</h2>
            <label>Nombre completo
              <input maxLength="40" value={nombre} onChange={(e) => setNombre(soloLetras(e.target.value))} required />
            </label>
            <label>Telefono
              <input type="tel" maxLength="10" value={telefono} onChange={(e) => setTelefono(soloNumeros(e.target.value))} required />
            </label>
            <label>Direccion de entrega
              <input maxLength="80" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
            </label>
            <p className="total"><span>Total a pagar</span><span>{formatoCOP(total)}</span></p>
            {error !== "" && <p className="error">{error}</p>}
            <button className="boton">Confirmar Pedido</button>
            <button type="button" className="enlace" onClick={() => setVista("carrito")}>Volver al Carrito</button>
          </form>
        )}

        {vista === "confirmacion" && (
          <div>
            <h2>¡Pedido Confirmado!</h2>
            <p className="error">{confirmacion}</p>
            <button className="boton" onClick={props.cerrar}>Seguir Comprando</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;