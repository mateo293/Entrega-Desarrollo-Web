import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);          // lista de usuarios activos
  const [inactivos, setInactivos] = useState([]);        // lista de usuarios inactivos
  const [roles, setRoles] = useState([]);                // lista de roles
  const [tiposDoc, setTiposDoc] = useState([]);          // lista de tipos de documento
  const [form, setForm] = useState({});                  // datos del formulario
  const [editando, setEditando] = useState(null);        // usuario que se está editando

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const [resUsuarios, resInactivos, resRoles, resTipos] = await Promise.all([
      api.get("/usuarios?estado=true"),
      api.get("/usuarios?estado=false"),
      api.get("/roles?estado=true"),
      api.get("/tiposDocumento?estado=true"),
    ]);

    setUsuarios(resUsuarios.data);
    setInactivos(resInactivos.data);
    setRoles(resRoles.data);
    setTiposDoc(resTipos.data);
  }

  // Maneja el cambio en los campos del formulario
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Validar antes de guardar
  function validar() {
    if (form.login.length > 40) return "El login no puede tener más de 40 caracteres";
    if (form.password && form.password.length > 200) return "La contraseña no puede tener más de 200 caracteres";
    if (!form.login) return "El login es obligatorio";
    if (!form.nombres) return "Los nombres son obligatorios";
    if (!form.apellidos) return "Los apellidos son obligatorios";
    if (!form.tipoDocumentoId) return "Debe seleccionar un tipo de documento";
    if (!form.numeroDocumento) return "Debe ingresar el número de documento";
    if (!form.email) return "Debe ingresar el correo electrónico";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Correo inválido";
    if (!form.telefono) return "Debe ingresar un número de teléfono";
    if (!/^[0-9]+$/.test(form.telefono)) return "El teléfono debe contener solo números";
    if (!form.fechaNacimiento) return "Debe ingresar una fecha de nacimiento";
    if (!form.fechaNacimiento) return "Debe ingresar una fecha de nacimiento";

    // Nueva validación: debe tener al menos 18 años
    const hoy = new Date();
    const nacimiento = new Date(form.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (!form.rolId) return "Debe seleccionar un rol";
  
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;

    if (edad < 18) return "El usuario debe ser mayor de 18 años";
    if (edad > 500) return "La edad no puede superar los 500 años";

    if (/\s/.test(form.login)) return "El login no debe contener espacios";
    if (!/^[a-zA-Z0-9._-]+$/.test(form.login))
    return "El login solo puede contener letras, números, puntos, guiones o guiones bajos";

    if (/\s/.test(form.email)) return "El correo no debe contener espacios";

    return null;
    
  }

  async function guardarUsuario() {
    const error = validar();
    const resLogin = await api.get("/usuarios");
    const usuariosConLogin = resLogin.data.filter((u) => u.estado && u.login && u.login.trim().toLowerCase() === loginIngresado);
    const rolSeleccionado = roles.find(r => r.id === parseInt(form.rolId));

    if (error) {
      alert(error);
      return;
    }

    // Normalizar los datos para comparación sin distinguir mayúsculas/minúsculas
    const loginIngresado = form.login.trim().toLowerCase();
    const emailIngresado = form.email.trim().toLowerCase();
    const documentoIngresado = form.numeroDocumento.trim().toLowerCase();
    

    // Validación de correo único (sin distinguir mayúsculas/minúsculas)
    const resCorreo = await api.get("/usuarios");
    const usuariosConCorreo = resCorreo.data.filter(
      (u) => u.estado && u.email && u.email.trim().toLowerCase() === emailIngresado
    );

    if (!editando && usuariosConCorreo.length > 0) {
      alert("Ya existe un usuario con este correo electrónico.");
      return;
    }
    if (editando && usuariosConCorreo.some((u) => u.id !== editando.id)) {
      alert("Ya existe otro usuario con este correo electrónico.");
      return;
    }

    // Si estamos creando un nuevo usuario
    if (!editando && usuariosConCorreo.length > 0) {
    alert("Ya existe un usuario con este correo electrónico.");
    return;
    }

    // Si estamos editando, asegurarse de que no pertenezca a otro usuario
    if (editando && usuariosConCorreo.some((u) => u.id !== editando.id)) {
    alert("Ya existe otro usuario con este correo electrónico.");
    return;
    }

    if (!editando && usuariosConLogin.length > 0) {
      alert("Ya existe un usuario con este login.");
      return;
    }
    if (editando && usuariosConLogin.some((u) => u.id !== editando.id)) {
      alert("Ya existe otro usuario con este login.");
      return;
    }

    if (rolSeleccionado && rolSeleccionado.nombre.toLowerCase() === "super administrador") {
      const resSuper = await api.get("/usuarios?estado=true");
      const superAdmins = resSuper.data.filter(u => {
        const rol = roles.find(r => r.id === u.rolId);
        return rol && rol.nombre.toLowerCase() === "super administrador";
      });

      // Si estás creando nuevo y ya hay 2 activos
      if (!editando && superAdmins.length >= 2) {
        alert("Ya existen 2 usuarios con rol Super Administrador. No puede crear más.");
        return;
      }

      // Si estás editando y cambiando a super admin
      if (editando && superAdmins.some(u => u.id !== editando.id) && superAdmins.length >= 2) {
        alert("Ya existen 2 usuarios con rol Super Administrador. No puede asignar este rol.");
        return;
      }
    }

    // Validación de número de documento único (sin distinguir mayúsculas/minúsculas)
    const resDoc = await api.get("/usuarios");
    const usuariosConDoc = resDoc.data.filter(
      (u) =>
        u.estado &&
        u.numeroDocumento &&
        u.numeroDocumento.trim().toLowerCase() === documentoIngresado
    );

    if (!editando && usuariosConDoc.length > 0) {
      alert("Ya existe un usuario con este número de documento.");
      return;
    }
    if (editando && usuariosConDoc.some((u) => u.id !== editando.id)) {
      alert("Ya existe otro usuario con este número de documento.");
      return;
    }



    // Si se está editando
    if (editando) {
      await api.patch(`/usuarios/${editando.id}`, {
        ...form,
        tipoDocumentoId: parseInt(form.tipoDocumentoId),
        rolId: parseInt(form.rolId),
        updatedAt: new Date().toISOString()
      });
      setEditando(null);
    } else {
      // Si es nuevo
      const nuevo = {
        ...form,
        tipoDocumentoId: parseInt(form.tipoDocumentoId),
        rolId: parseInt(form.rolId),
        estado: true,
        createdAt: new Date().toISOString(),
        createdBy: "web"
      };
      await api.post("/usuarios", nuevo);
    }

    setForm({});
    cargarDatos();
  }

  async function eliminarUsuario(u) {
    await api.patch(`/usuarios/${u.id}`, { estado: false });
    cargarDatos();
  }

  async function reactivarUsuario(u) {
    await api.patch(`/usuarios/${u.id}`, { estado: true });
    cargarDatos();
  }

  function editarUsuario(u) {
    setForm(u);
    setEditando(u);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Usuarios</h2>

      {/* Formulario */}
      <div style={{
        border: "1px solid #ccc",
        padding: 10,
        marginBottom: 20,
        borderRadius: 8
      }}>
        <h3>{editando ? "Editar Usuario" : "Nuevo Usuario"}</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input placeholder="Login" name="login" value={form.login || ""} onChange={handleChange} />
          <input type="password" placeholder="Contraseña" name="password" value={form.password || ""} onChange={handleChange} />
          <input placeholder="Nombres" name="nombres" value={form.nombres || ""} onChange={handleChange} />
          <input placeholder="Apellidos" name="apellidos" value={form.apellidos || ""} onChange={handleChange} />

          <select name="tipoDocumentoId" value={form.tipoDocumentoId || ""} onChange={handleChange}>
            <option value="">Tipo de Documento</option>
            {tiposDoc.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>

          <input placeholder="Número de documento" name="numeroDocumento" value={form.numeroDocumento || ""} onChange={handleChange} />

          <select name="genero" value={form.genero || ""} onChange={handleChange}>
            <option value="">Género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>

          <input placeholder="Correo electrónico" name="email" value={form.email || ""} onChange={handleChange} />
          <input placeholder="Teléfono" name="telefono" value={form.telefono || ""} onChange={handleChange} />
          <input type="date" name="fechaNacimiento" value={form.fechaNacimiento || ""} onChange={handleChange} />
          
          <input type="file" name="foto" accept="image/*" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setForm({ ...form, foto: reader.result });
              reader.readAsDataURL(file);
            }
          }} />

          <select name="rolId" value={form.rolId || ""} onChange={handleChange}>
            <option value="">Rol</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 10 }}>
          <button onClick={guardarUsuario}>{editando ? "Actualizar" : "Guardar"}</button>
          {editando && (
            <button onClick={() => { setForm({}); setEditando(null); }}>Cancelar</button>
          )}
        </div>
      </div>

      {/* Lista de usuarios activos */}
      <h3>Usuarios Activos</h3>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.nombres} {u.apellidos} — {u.email} — {roles.find(r => r.id === u.rolId)?.nombre}
            {" "}
            <button onClick={() => editarUsuario(u)}>Editar</button>
            <button onClick={() => eliminarUsuario(u)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {/* Lista de usuarios inactivos */}
      <h3>Usuarios Inactivos</h3>
      <ul>
        {inactivos.map((u) => (
          <li key={u.id}>
            {u.nombres} {u.apellidos} — {u.email}
            {" "}
            <button onClick={() => reactivarUsuario(u)}>Reactivar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
