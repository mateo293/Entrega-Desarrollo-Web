import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Roles from "./pages/Roles";
import TiposDocumento from "./pages/TiposDocumento";
import Usuarios from "./pages/Usuarios";



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Si entra a la raíz (/) lo mandamos al Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Login no requiere protección */}
        <Route path="/login" element={<Login />} />

        {/* Estas rutas sí necesitan sesión */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <Roles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipos-documento"
          element={
            <ProtectedRoute>
              <TiposDocumento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
