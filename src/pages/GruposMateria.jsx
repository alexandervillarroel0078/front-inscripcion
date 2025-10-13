import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGruposPorMateria, inscribirse } from "../api";

export default function GruposMateria() {
  const { codigo } = useParams();
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const registro = localStorage.getItem("registro");

  useEffect(() => {
    getGruposPorMateria(codigo)
      .then((data) => setGrupos(data.grupos))
      .catch((err) => console.error("❌ Error cargando grupos:", err))
      .finally(() => setLoading(false));
  }, [codigo]);

  const handleInscribirse = async (g) => {
    const dto = {
      registro,
      periodoId: 1,
      materias: [{ materiaCodigo: codigo, grupo: g.grupo }]
    };

    try {
      const res = await inscribirse(dto);
      alert(`✅ Solicitud enviada.\nEstado: ${res.estado}`);
    } catch (error) {
      console.error("❌ Error al inscribirse:", error);
      alert("Error al enviar inscripción");
    }
  };

  if (loading) return <p>Cargando grupos...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Grupos para {codigo}</h2>
      {grupos.length === 0 ? (
        <p>No hay grupos disponibles.</p>
      ) : (
        <ul>
          {grupos.map((g) => (
            <li key={g.id}>
              <strong>Grupo {g.grupo}</strong> — Docente: {g.docente}  
              <br />
              Aula: {g.aula} — Cupos: {g.cupo}
              <br />
              <button
                onClick={() => handleInscribirse(g)}
                className="btn"
                style={{ marginTop: "8px" }}
              >
                Inscribirme
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
