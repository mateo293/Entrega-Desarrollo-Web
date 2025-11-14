import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Roles() {
  const [roles, setRoles] = useState([]);      // guarda la lista de roles activos
  const [nombre, setNombre] = useState("");    // guarda lo que el usuario escribe para crear uno nuevo
  const [inactivos, setInactivos] = useState([]); // lista de roles inactivos

  // Cargar roles cuando se abre la página
  useEffect(() => {
    cargarRoles();
    cargarInactivos();
  }, []);

  async function cargarRoles() {
    const res = await api.get("/roles?estado=true");
    setRoles(res.data);
  }

  async function cargarInactivos() {
    const res = await api.get("/roles?estado=false");
    setInactivos(res.data);
  }

  async function crearRol() {
    if (!nombre) {
      alert("Debe escribir un nombre para el rol");
      return;
    }

    // Validar duplicado de nombre de rol (sin distinguir mayúsculas/minúsculas)
    const resDuplicado = await api.get("/roles");
    const existe = resDuplicado.data.some(
      (r) => r.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe) {
      alert("Ya existe un rol con ese nombre.");
      return;
    }


    // Validar la regla especial: máximo 2 Super Administradores
    if (nombre.toLowerCase() === "super administrador") {
      const res = await api.get("/roles?nombre=Super Administrador");
      const existentes = res.data.filter((r) => r.estado === true);
      if (existentes.length >= 2) {
        alert("Ya existen 2 Super Administradores activos. No puede crear más.");
        return;
      }
    }

    const nuevoRol = {
      nombre: nombre,
      estado: true,
      createdAt: new Date().toISOString(),
      createdBy: "web"
    };

    await api.post("/roles", nuevoRol);
    setNombre("");
    cargarRoles();
  }

  async function eliminarRol(rol) {
    // eliminación lógica (estado = false)
    await api.patch(`/roles/${rol.id}`, {
      estado: false,
      updatedAt: new Date().toISOString()
    });
    cargarRoles();
    cargarInactivos();
  }

  async function reactivarRol(rol) {
    await api.patch(`/roles/${rol.id}`, {
      estado: true,
      updatedAt: new Date().toISOString()
    });
    cargarRoles();
    cargarInactivos();
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Roles</h2>

      {/* Crear nuevo rol */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nuevo rol"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button onClick={crearRol}>Crear Rol</button>
      </div>

      {/* Lista de roles activos */}
      <h3>Roles Activos</h3>
      <ul>
        {roles.map((r) => (
          <li key={r.id}>
            {r.nombre}{" "}
            <button onClick={() => eliminarRol(r)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {/* Lista de roles inactivos */}
      <h3>Roles Inactivos (para reactivar)</h3>
      <ul>
        {inactivos.map((r) => (
          <li key={r.id}>
            {r.nombre}{" "}
            <button onClick={() => reactivarRol(r)}>Reactivar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
