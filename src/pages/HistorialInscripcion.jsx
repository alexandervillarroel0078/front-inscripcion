//pages/HistorialInscripcion.jsx
import React, { useEffect, useState } from "react";
import { getEstadoInscripcion } from "../api";

export default function HistorialInscripcion() {
  const [estado, setEstado] = useState([]);
  const [loading, setLoading] = useState(true);
  const registro = localStorage.getItem("registro");

  useEffect(() => {
    if (!registro) {
      alert("Debes iniciar sesión primero");
      return;
    }

    getEstadoInscripcion(registro)
      .then(setEstado)
      .catch((err) => console.error("❌ Error al obtener estado:", err))
      .finally(() => setLoading(false));
  }, [registro]);

  if (loading)
    return <p style={{ textAlign: "center" }}>Cargando estado de inscripción...</p>;

  if (estado.mensaje)
    return (
      <div className="center">
        <h2>📋 Estado de Inscripción</h2>
        <p>{estado.mensaje}</p>
      </div>
    );

  // 🔹 Colores según estado
  const getEstadoColor = (estado) => {
    switch (estado?.toUpperCase()) {
      case "CONFIRMADA":
        return "#4CAF50"; // verde
      case "RECHAZADA":
        return "#E53935"; // rojo
      case "PENDIENTE":
        return "#FB8C00"; // naranja
      case "PARCIAL":
        return "#1E88E5"; // azul
      default:
        return "#757575"; // gris neutro
    }
  };

  // 🔧 Ajustar estados de materias según el estado global
  const inscripcionesAjustadas = estado.map((insc) => {
    if (insc.estado?.toUpperCase() === "RECHAZADA") {
      return {
        ...insc,
        materias: insc.materias.map((m) => ({
          ...m,
          estado:
            m.estado?.toUpperCase() === "INSCRITO"
              ? m.estado
              : "RECHAZADA",
        })),
      };
    }

    if (insc.estado?.toUpperCase() === "CONFIRMADA") {
      return {
        ...insc,
        materias: insc.materias.map((m) => ({
          ...m,
          estado:
            m.estado?.toUpperCase() === "PENDIENTE"
              ? "INSCRITO"
              : m.estado,
        })),
      };
    }

    return insc;
  });

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", color: "#0d47a1" }}>
        📋 Estado de Inscripción
      </h2>

      {inscripcionesAjustadas.map((insc) => (
        <div
          key={insc.id}
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "15px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            borderLeft: `8px solid ${getEstadoColor(insc.estado)}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: 0 }}>Periodo: {insc.periodoId}</h3>
            <span
              style={{
                backgroundColor: getEstadoColor(insc.estado),
                color: "white",
                padding: "5px 12px",
                borderRadius: "20px",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "0.85rem",
              }}
            >
              {insc.estado}
            </span>
          </div>

          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {insc.materias.map((m, idx) => (
              <li
                key={idx}
                style={{
                  background: "#f8f9fa",
                  borderRadius: "6px",
                  padding: "10px",
                  marginBottom: "8px",
                  borderLeft: `4px solid ${getEstadoColor(m.estado)}`,
                }}
              >
                <strong>{m.codigo}</strong> — {m.nombre} ({m.grupo})
                <span
                  style={{
                    float: "right",
                    fontWeight: "bold",
                    color: getEstadoColor(m.estado),
                  }}
                >
                  {m.estado}
                </span>
              </li>
            ))}
          </ul>

          <p style={{ textAlign: "right", fontSize: "0.85rem", color: "#555" }}>
            📅 Fecha: {new Date(insc.fecha).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
