import { useState } from "react";
import { API } from "../configuracion";
import { soloLetras, soloNumeros, sinEspacios, nombreValido, correoValido, telefonoValido, claveValida } from "../validaciones";

function Registro(props) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [clave, setClave] = useState("");
  const [clave2, setClave2] = useState("");
  const [error, setError] = useState("");

  async function enviar(e) {
    e.preventDefault();
    if (!nombreValido(nombre)) return setError("El nombre debe tener mínimo 3 letras");
    if (!correoValido(correo)) return setError("Escribe un correo válido, por ejemplo nombre@correo.com");
    if (!telefonoValido(telefono)) return setError("El teléfono debe tener 10 números y empezar por 3");
    if (!claveValida(clave)) return setError("La clave debe tener de 6 a 20 caracteres, con letras y números");
    if (clave !== clave2) return setError("Las claves no son iguales");

    try {
      const respuesta = await fetch(API + "/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, telefono, clave }),
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
      <h2>Crear cuenta</h2>
      <form className="formulario" onSubmit={enviar}>
        <label>Nombre (solo letras)
          <input maxLength="40" value={nombre} onChange={(e) => setNombre(soloLetras(e.target.value))} />
        </label>
        <label>Correo
          <input type="email" maxLength="50" value={correo} onChange={(e) => setCorreo(sinEspacios(e.target.value))} />
        </label>
        <label>Teléfono (10 números, empieza por 3)
          <input type="tel" maxLength="10" value={telefono} onChange={(e) => setTelefono(soloNumeros(e.target.value))} />
        </label>
        <label>Clave (6 a 20 caracteres, letras y números)
          <input type="password" maxLength="20" value={clave} onChange={(e) => setClave(sinEspacios(e.target.value))} />
        </label>
        <label>Repetir clave
          <input type="password" maxLength="20" value={clave2} onChange={(e) => setClave2(sinEspacios(e.target.value))} />
        </label>
        {error !== "" && <p className="error">{error}</p>}
        <button className="boton">Registrarme</button>
      </form>
    </main>
  );
}

export default Registro;