import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.get(`/usuarios?login=${encodeURIComponent(login)}&estado=true`);
      const users = res.data;

      if (users.length === 0) {
        setError("Usuario no encontrado");
        return;
      }

      const user = users[0];

      if (user.password !== password) {
        setError("Contraseña incorrecta");
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(user));
      navigate("/dashboard");
    } catch {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input value={login} onChange={(e) => setLogin(e.target.value)} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
