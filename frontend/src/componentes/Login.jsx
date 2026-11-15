import { useState } from "react";
import { API } from "../configuracion";
import { sinEspacios, correoValido } from "../validaciones";

function Login(props) {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  async function enviar(e) {
    e.preventDefault();
    if (!correoValido(correo)) return setError("Escribe un correo válido, por ejemplo nombre@correo.com");
    if (clave === "") return setError("Escribe tu clave");

    try {
      const respuesta = await fetch(API + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, clave }),
      });
      const datos = await respuesta.json();
      if (respuesta.ok) props.entrar({ ...datos, clave });
      else setError(datos.error);
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  }

  return (
    <main className="pagina">
      <h2>Iniciar sesión</h2>
      <form className="formulario" onSubmit={enviar}>
        <label>Correo
          <input type="email" maxLength="50" value={correo} onChange={(e) => setCorreo(sinEspacios(e.target.value))} />
        </label>
        <label>Clave
          <input type="password" maxLength="20" value={clave} onChange={(e) => setClave(sinEspacios(e.target.value))} />
        </label>
        {error !== "" && <p className="error">{error}</p>}
        <button className="boton">Entrar</button>
      </form>
    </main>
  );
}

export default Login;