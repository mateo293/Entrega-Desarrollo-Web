import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  const logout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <nav style={{
      padding: "10px",
      background: "#f2f2f2",
      borderBottom: "1px solid #ccc"
    }}>
      <Link to="/dashboard" style={{ marginRight: 15 }}>Sistema</Link>
      <Link to="/usuarios" style={{ marginRight: 15 }}>Usuarios</Link>
      <Link to="/roles" style={{ marginRight: 15 }}>Roles</Link>
      <Link to="/tipos-documento" style={{ marginRight: 15 }}>Tipos de Documento</Link>

      <div style={{ float: "right" }}>
        {usuario ? (
          <>
            <span style={{ marginRight: 10 }}>{usuario.login}</span>
            <button onClick={logout}>Cerrar sesión</button>
          </>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}
