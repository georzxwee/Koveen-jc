import { useState } from "react";
import { API } from "../configuracion";
import { soloLetras, sinEspacios, correoValido } from "../validaciones";

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function enviar(e) {
    e.preventDefault();
    if (!correoValido(correo)) return alert("Escribe un correo válido, por ejemplo nombre@correo.com");

    try {
      const respuesta = await fetch(API + "/api/mensajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, mensaje }),
      });
      if (!respuesta.ok) return alert("No se pudo enviar el mensaje");
      alert("¡Mensaje enviado! Gracias por escribirnos.");
      setNombre("");
      setCorreo("");
      setMensaje("");
    } catch {
      alert("No se pudo conectar con el servidor");
    }
  }

  return (
    <main className="pagina">
      <h2>Contacto</h2>
      <form className="formulario" onSubmit={enviar}>
        <label>Nombre
          <input maxLength="40" value={nombre} onChange={(e) => setNombre(soloLetras(e.target.value))} required />
        </label>
        <label>Correo
          <input type="email" maxLength="50" value={correo} onChange={(e) => setCorreo(sinEspacios(e.target.value))} required />
        </label>
        <label>Mensaje
          <textarea rows="5" maxLength="300" value={mensaje} onChange={(e) => setMensaje(e.target.value)} required></textarea>
        </label>
        <button className="boton">Enviar mensaje</button>
      </form>
    </main>
  );
}

export default Contacto;