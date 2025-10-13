import React, { useEffect, useState } from "react";
import { getMateriasDisponibles } from "../api";
import { useNavigate } from "react-router-dom";

export default function Materias() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const registro = localStorage.getItem("registro");
  const navigate = useNavigate();

  useEffect(() => {
    if (!registro) {
      alert("Debes iniciar sesión primero");
      navigate("/login");
      return;
    }

    getMateriasDisponibles(registro)
      .then(setMaterias)
      .catch((err) => console.error("❌ Error cargando materias:", err))
      .finally(() => setLoading(false));
  }, [registro, navigate]);

  if (loading) return <p>Cargando materias disponibles...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Materias disponibles</h1>
      {materias.length === 0 ? (
        <p>No hay materias pendientes.</p>
      ) : (
        <ul>
          {materias.map((m) => (
            <li key={m.codigo}>
              <strong>{m.nombre}</strong> ({m.codigo})  
              <button
                onClick={() => navigate(`/materias/${m.codigo}`)}
                className="btn"
                style={{ marginLeft: "10px" }}
              >
                Ver grupos
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
