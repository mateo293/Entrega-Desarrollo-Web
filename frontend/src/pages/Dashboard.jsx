import React from "react";

export default function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  return (
    <div style={{ padding: 20 }}>
      <h1>Bienvenido {usuario?.nombres || "Usuario"} 👋</h1>
      <p>Usa el menú superior para navegar por el sistema.</p>
    </div>
  );
}
