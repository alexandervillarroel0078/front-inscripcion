import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPerfil } from "../api"; // 👈 importa tu función que llama /estudiantes/me

export default function Home() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Verificar token y cargar perfil al entrar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const cargarPerfil = async () => {
      try {
        const data = await getPerfil();
        setPerfil(data);
      } catch (err) {
        setError("Sesión inválida o expirada. Inicia sesión nuevamente.");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [navigate]);

  // ✅ Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ⏳ Estado de carga
  if (loading) {
    return (
      <div className="center">
        <h2>🔄 Cargando perfil...</h2>
      </div>
    );
  }

  // ⚠️ Si hubo error (token inválido, por ejemplo)
  if (error) {
    return (
      <div className="center">
        <h2>⚠️ {error}</h2>
        <Link to="/login" className="btn">Ir al Login</Link>
      </div>
    );
  }

  // ✅ Vista principal si el usuario está logueado
  return (
    <div className="center">
      <h1>🏫 Sistema de Inscripción Universitaria</h1>

      {perfil ? (
        <>
          <p>
            Bienvenido, <strong>{perfil.nombre}</strong><br />
            <small>Registro: {perfil.registro}</small><br />
            <small>Carrera: {perfil.carrera}</small>
          </p>

          <nav style={{ marginTop: "1rem" }}>
            <Link to="/materias" className="btn">📚 Materias</Link>
            <Link to="/estado" className="btn">📋 Estado Inscripción</Link>
          </nav>

          <button onClick={handleLogout} className="btn" style={{ marginTop: "1.5rem" }}>
            🚪 Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <p>No se pudo cargar el perfil.</p>
          <Link to="/login" className="btn">Volver al Login</Link>
        </>
      )}
    </div>
  );
}
