 
import React, { useEffect, useState } from "react";
import { getMateriasDisponibles, getGruposPorMateria, inscribirse } from "../api";
import { useNavigate } from "react-router-dom";

export default function InscripcionMaterias() {
  const [materias, setMaterias] = useState([]);
  const [expanded, setExpanded] = useState([]); // ✅ varias abiertas
  const [loading, setLoading] = useState(true);
  const [seleccionadas, setSeleccionadas] = useState([]);
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

  // ✅ Alternar abrir/cerrar cada materia
  const toggleExpand = async (codigo) => {
    if (expanded.includes(codigo)) {
      setExpanded((prev) => prev.filter((c) => c !== codigo));
      return;
    }

    setExpanded((prev) => [...prev, codigo]);

    setMaterias((prev) =>
      prev.map((m) =>
        m.codigo === codigo ? { ...m, loadingGrupos: true } : m
      )
    );

    try {
      const data = await getGruposPorMateria(codigo);
      setMaterias((prev) =>
        prev.map((m) =>
          m.codigo === codigo ? { ...m, grupos: data.grupos, loadingGrupos: false } : m
        )
      );
    } catch (err) {
      console.error("Error al cargar grupos:", err);
      alert("Error al obtener grupos");
    }
  };

  // ✅ Alternar selección de grupo
  const toggleSeleccion = (materiaCodigo, grupo) => {
    const key = `${materiaCodigo}-${grupo}`;
    setSeleccionadas((prev) =>
      prev.some((s) => s.materiaCodigo === materiaCodigo && s.grupo === grupo)
        ? prev.filter((s) => `${s.materiaCodigo}-${s.grupo}` !== key)
        : [...prev, { materiaCodigo, grupo }]
    );
  };

  // ✅ Enviar todas las seleccionadas y redirigir a /estado/:id
  const handleInscribirse = async () => {
    if (seleccionadas.length === 0) {
      alert("Selecciona al menos una materia antes de inscribirte.");
      return;
    }

    const dto = {
      registro,
      periodoId: 1,
      materias: seleccionadas,
    };

    try {
      const res = await inscribirse(dto);

      // // 🔹 Mostrar confirmación inicial
      // alert(`📦 Solicitud encolada.\nID: ${res.transactionId}`);

      // 🔹 Redirigir al estado (igual que antes)
      navigate(`/estado/${res.transactionId}`);

      // Limpiar selección
      setSeleccionadas([]);
    } catch (error) {
      console.error("❌ Error al inscribirse:", error);
      alert("Error al enviar inscripción");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Cargando materias...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Inscripción de Materias con Grupos
      </h1>

      {materias.length === 0 ? (
        <p>No hay materias disponibles.</p>
      ) : (
        materias.map((m) => (
          <div
            key={m.codigo}
            style={{
              background: "#fff",
              borderRadius: "10px",
              marginBottom: "15px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              padding: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => toggleExpand(m.codigo)}
            >
              <div>
                <h3 style={{ margin: 0 }}>{m.nombre}</h3>
                <small>
                  Créditos: {m.creditos} |{" "}
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {m.gruposDisponibles} grupos disponibles
                  </span>
                </small>
              </div>
              <span style={{ fontSize: "20px" }}>
                {expanded.includes(m.codigo) ? "−" : "+"}
              </span>
            </div>

            {expanded.includes(m.codigo) && (
              <div style={{ marginTop: "10px" }}>
                {m.grupos?.length > 0 ? (
                  m.grupos.map((g) => {
                    const isSelected = seleccionadas.some(
                      (s) => s.materiaCodigo === m.codigo && s.grupo === g.grupo
                    );

                    return (
                      <div
                        key={g.id}
                        style={{
                          background: isSelected ? "#d1f7c4" : "#f9f9f9",
                          borderRadius: "8px",
                          padding: "10px 15px",
                          marginTop: "8px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          border: isSelected
                            ? "2px solid #4CAF50"
                            : "1px solid #ccc",
                        }}
                      >
                        <div>
                          <strong>Grupo {g.grupo}</strong> — {g.horario}
                          <br />
                          Profesor: {g.docente} | Aula: {g.aula}
                          <br />
                          Cupos: {g.cupo}
                        </div>

                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            toggleSeleccion(m.codigo, g.grupo)
                          }
                          style={{ width: "20px", height: "20px" }}
                        />
                      </div>
                    );
                  })
                ) : (
                  <p>No hay grupos disponibles.</p>
                )}
              </div>
            )}
          </div>
        ))
      )}

      {/* ✅ Botón final para enviar todas las materias seleccionadas */}
      {seleccionadas.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={handleInscribirse}
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 20px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            📝 Inscribirme ({seleccionadas.length} seleccionadas)
          </button>
        </div>
      )}
    </div>
  );
}
