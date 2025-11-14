import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function TiposDocumento() {
  const [tipos, setTipos] = useState([]);         // lista de tipos activos
  const [inactivos, setInactivos] = useState([]); // lista de tipos inactivos
  const [nombre, setNombre] = useState("");       // campo del formulario

  useEffect(() => {
    cargarTipos();
    cargarInactivos();
  }, []);

  async function cargarTipos() {
    const res = await api.get("/tiposDocumento?estado=true");
    setTipos(res.data);
  }

  async function cargarInactivos() {
    const res = await api.get("/tiposDocumento?estado=false");
    setInactivos(res.data);
  }

  async function crearTipo() {
    if (!nombre.trim()) {
      alert("Debe ingresar un nombre válido");
      return;
    }

    // Validar duplicado (independiente del estado)
    const res = await api.get(`/tiposDocumento?nombre=${encodeURIComponent(nombre)}`);
    const existentes = res.data;

    if (existentes.length > 0) {
      const tipoExistente = existentes[0];

      if (tipoExistente.estado === true) {
        alert("Ese tipo de documento ya existe y está activo.");
        return;
      } else {
        const confirmar = window.confirm(
          "Ese tipo de documento existe pero está inactivo. ¿Desea reactivarlo?"
        );
        if (confirmar) {
          await api.patch(`/tiposDocumento/${tipoExistente.id}`, {
            estado: true,
            updatedAt: new Date().toISOString()
          });
          cargarTipos();
          cargarInactivos();
          setNombre("");
        }
        return;
      }
    }

    const nuevoTipo = {
      nombre: nombre,
      estado: true,
      createdAt: new Date().toISOString(),
      createdBy: "web"
    };

    await api.post("/tiposDocumento", nuevoTipo);
    setNombre("");
    cargarTipos();
  }

  async function eliminarTipo(tipo) {
    await api.patch(`/tiposDocumento/${tipo.id}`, {
      estado: false,
      updatedAt: new Date().toISOString()
    });
    cargarTipos();
    cargarInactivos();
  }

  async function reactivarTipo(tipo) {
    await api.patch(`/tiposDocumento/${tipo.id}`, {
      estado: true,
      updatedAt: new Date().toISOString()
    });
    cargarTipos();
    cargarInactivos();
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Tipos de Documento</h2>

      {/* Crear nuevo tipo */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Nuevo tipo de documento"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button onClick={crearTipo}>Crear Tipo</button>
      </div>

      {/* Lista de tipos activos */}
      <h3>Tipos Activos</h3>
      <ul>
        {tipos.map((t) => (
          <li key={t.id}>
            {t.nombre}{" "}
            <button onClick={() => eliminarTipo(t)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {/* Lista de tipos inactivos */}
      <h3>Tipos Inactivos (para reactivar)</h3>
      <ul>
        {inactivos.map((t) => (
          <li key={t.id}>
            {t.nombre}{" "}
            <button onClick={() => reactivarTipo(t)}>Reactivar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
