# Miniproyecto de Desarrollo Web  
CRUD de Usuarios, Roles y Tipos de Documento  
**React + JSON Server (Node.js)**

Este proyecto es una aplicación web tipo **SPA (Single Page Application)** desarrollada con **React** para el frontend y **json-server** como backend simulado.  
Permite gestionar **Usuarios**, **Roles**, y **Tipos de Documento** cumpliendo todas las reglas solicitadas en el enunciado del trabajo.

---

## Características principales

### ✔ Aplicación SPA con React  
No recarga la página, todos los módulos funcionan dentro de la misma interfaz.

### ✔ Backend simulado con JSON Server  
El archivo `db.json` actúa como base de datos y soporta:
- GET
- POST
- PATCH
- DELETE (solo baja lógica)

### ✔ Módulo de Usuarios (CRUD completo)
Incluye:
- Crear usuarios  
- Editar usuarios  
- Desactivar / Reactivar  
- Listar activos e inactivos  
- Subida de foto (Base64)  
- Validaciones avanzadas

### ✔ Módulo de Roles (CRUD completo)
Incluye:
- Crear roles  
- Editar  
- Activar / Desactivar  
- Validación de duplicados  
- No distingue mayúsculas/minúsculas

### ✔ Módulo de Tipos de Documento
- Crear  
- Editar  
- Activar / Desactivar  
- Validación de duplicados  
- Reactivación inteligente  

---

# Validaciones implementadas

El proyecto incluye todas las validaciones pedidas en clase y algunas adicionales de calidad:

### Validaciones del Login
- Máximo **40 caracteres**
- Sin espacios
- Sin caracteres especiales (solo letras, números, puntos, guiones)
- **Único** (sin distinguir mayúsculas/minúsculas)

### Validaciones de Contraseña
- Máximo **200 caracteres**

### Validaciones del Correo
- Sin espacios
- Formato correcto
- **Único** (sin distinguir mayúsculas/minúsculas)

### Validaciones del Documento
- Único (sin distinguir mayúsculas/minúsculas)

### Validaciones de Edad
- **Mínimo 18 años**
- **Máximo 500 años**

### Rol Super Administrador
- Solo pueden existir **máximo 2 usuarios activos** con este rol en todo el sistema.

### Validaciones de Roles
- No se permiten roles duplicados
- No distingue mayúsculas/minúsculas
- reactiva un rol si existe y está inactivo

---
# INSTALACIÓN Y EJECUCIÓN

### PASO 1: Clonar el repositorio

- git clone https://github.com/mateo293/Entrega-Desarrollo-Web.git

- cd Entrega-Desarrollo-Web

## BACKEND (JSON SERVER)

### PASO 2: Instalar dependencias

- cd backend

- npm install

### PASO 3: Iniciar backend

- npm start

El backend se ejecuta en:
http://localhost:3001/

## FRONTEND (REACT)

### PASO 4: Instalar dependencias
- cd ..
- cd frontend
- npm install

### PASO 5: Iniciar frontend
- npm start

El frontend se ejecuta en:
http://localhost:3000/

El usuario inicial es admin y la contraseña admin


---
# TECNOLOGÍAS UTILIZADAS

- React
- React Router
- JSON Server
- Node.js
- HTML
- CSS
- JavaScript

---
# AUTOR

- Cristian Mateo Castro Perfetti
- Entrega para la asignatura Desarrollo Web.
- Universidad del Cauca
- Año 2025

---
LICENCIA
Proyecto académico sin fines comerciales.

