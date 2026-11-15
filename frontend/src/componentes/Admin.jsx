import { useState } from "react";
import { API } from "../configuracion";
import { formatoCOP } from "../descuentos";

function Admin(props) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [material, setMaterial] = useState("");
  const [categoria, setCategoria] = useState("ropa");
  const [imagen, setImagen] = useState("images/productos/001.jpg");

  const cabeceras = { "Content-Type": "application/json", correo: props.usuario.correo, clave: props.usuario.clave };

  async function crearProducto(e) {
    e.preventDefault();
    const respuesta = await fetch(API + "/api/productos", {
      method: "POST",
      headers: cabeceras,
      body: JSON.stringify({ nombre, precio: Number(precio), categoria, etiqueta: material, imagen }),
    });
    if (!respuesta.ok) return;
    props.setProductos([...props.productos, await respuesta.json()]);
    setNombre("");
    setPrecio("");
    setMaterial("");
  }

  async function borrarProducto(id) {
    await fetch(API + "/api/productos/" + id, { method: "DELETE", headers: cabeceras });
    props.setProductos(props.productos.filter((p) => p._id !== id));
  }

  return (
    <main className="pagina">
      <h2>Panel de administrador</h2>

      <h3>Agregar producto</h3>
      <form className="formulario" onSubmit={crearProducto}>
        <label>Nombre
          <input maxLength="40" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>
        <label>Precio
          <input type="number" min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
        </label>
        <label>Material
          <input maxLength="40" value={material} onChange={(e) => setMaterial(e.target.value)} />
        </label>
        <label>Categoría
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="ropa">Ropa</option>
            <option value="accesorios">Accesorios</option>
            <option value="calzado">Calzado</option>
          </select>
        </label>
        <label>Ruta de la imagen
          <input value={imagen} onChange={(e) => setImagen(e.target.value)} required />
        </label>
        <button className="boton">Guardar producto</button>
      </form>

      <h3>Productos ({props.productos.length})</h3>
      {props.productos.map((p) => (
        <div className="fila" key={p._id}>
          <span>{p.nombre} · {p.categoria} · {formatoCOP(p.precio)}</span>
          <button className="boton-pequeno" onClick={() => borrarProducto(p._id)}>Eliminar</button>
        </div>
      ))}

      <h3>Mensajes de contacto ({props.mensajes.length})</h3>
      {props.mensajes.map((m) => (
        <div className="tarjeta" key={m._id}>
          <strong>{m.nombre}</strong> ({m.correo})
          <p>{m.mensaje}</p>
        </div>
      ))}

      <h3>Pedidos ({props.pedidos.length})</h3>
      {props.pedidos.map((p) => (
        <div className="tarjeta" key={p._id}>
          <strong>Pedido #{p.numero}</strong> · {p.nombre} · {p.telefono} · {p.direccion}
          <p>{p.productos}</p>
          <p><strong>Total: {formatoCOP(p.total)}</strong></p>
        </div>
      ))}
    </main>
  );
}

export default Admin;