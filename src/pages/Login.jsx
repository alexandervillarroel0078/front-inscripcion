import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginEstudiante, getPerfil } from "../api";

export default function Login() {
  const [registro, setRegistro] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👈 para redirigir

  const handleLogin = async () => {
    setError("");
    if (!registro.trim() || !password.trim()) {
      setError("Por favor ingresa tu registro y contraseña.");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Paso 1: iniciar sesión y guardar token
      const { token } = await loginEstudiante(registro, password);

      // 🔹 Paso 2: obtener perfil
      const perfilData = await getPerfil();

      // 🔹 Guarda datos en localStorage (opcional para mostrar en Home)
      localStorage.setItem("nombre", perfilData.nombre);
      localStorage.setItem("registro", perfilData.registro);

      setLoading(false);

      // 🔹 Redirige a la pantalla principal (Home)
      navigate("/"); //      navigate("/Home"); son practicamente iguales
    } catch (err) {
      setLoading(false);
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="center">
      <h1>Iniciar Sesión</h1>
      <input
        type="text"
        placeholder="Registro universitario"
        value={registro}
        onChange={(e) => setRegistro(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} className="btn" disabled={loading}>
        {loading ? "Conectando..." : "Entrar"}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
