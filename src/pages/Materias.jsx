// import React, { useEffect, useState } from "react";
// import { getMateriasDisponibles } from "../api";
// import { useNavigate } from "react-router-dom";

// export default function Materias() {
//   const [materias, setMaterias] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const registro = localStorage.getItem("registro");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!registro) {
//       alert("Debes iniciar sesión primero");
//       navigate("/login");
//       return;
//     }

//     getMateriasDisponibles(registro)
//       .then(setMaterias)
//       .catch((err) => console.error("❌ Error cargando materias:", err))
//       .finally(() => setLoading(false));
//   }, [registro, navigate]);

//   if (loading) return <p>Cargando materias disponibles...</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Materias disponibles</h1>
//       {materias.length === 0 ? (
//         <p>No hay materias pendientes.</p>
//       ) : (
//         <ul>
//           {materias.map((m) => (
//             <li key={m.codigo}>
//               <strong>{m.nombre}</strong> ({m.codigo})  
//               <button
//                 onClick={() => navigate(`/materias/${m.codigo}`)}
//                 className="btn"
//                 style={{ marginLeft: "10px" }}
//               >
//                 Ver grupos
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
// import { getMateriasDisponibles, getGruposPorMateria, inscribirse } from "../api";
import { getMateriasDisponibles, getGruposPorMateria } from "../api";
import InscribirMateria from "../components/InscribirMateria";
import { useNavigate } from "react-router-dom";

export default function InscripcionMaterias() {
  const [materias, setMaterias] = useState([]);
  const [expanded, setExpanded] = useState(null);
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

  const toggleExpand = async (codigo) => {
    if (expanded === codigo) {
      setExpanded(null);
      return;
    }

    setExpanded(codigo);
    // Si la materia aún no tiene sus grupos cargados, los obtenemos
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

  const handleInscribirse = async (materiaCodigo, grupo) => {
    const dto = {
      registro,
      periodoId: 1,
      materias: [{ materiaCodigo, grupo }]
    };

    try {
      const res = await inscribirse(dto);
      alert(`✅ Solicitud enviada.\nEstado: ${res.estado}`);
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
              padding: "15px"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer"
              }}
              onClick={() => toggleExpand(m.codigo)}
            >
              <div>
                <h3 style={{ margin: 0 }}>{m.nombre}</h3>
                <small>
                  Créditos: {m.creditos} | Estado:{" "}
                  <span
                    style={{
                      color: "green",
                      fontWeight: "bold"
                    }}
                  >
                    {m.gruposDisponibles} grupos disponibles
                  </span>
                </small>
              </div>
              <span style={{ fontSize: "20px" }}>
                {expanded === m.codigo ? "−" : "+"}
              </span>
            </div>

            {expanded === m.codigo && (
              <div style={{ marginTop: "10px" }}>
                {m.grupos?.length > 0 ? (
                  m.grupos.map((g) => (
                    <div
                      key={g.id}
                      style={{
                        background: "#f9f9f9",
                        borderRadius: "8px",
                        padding: "10px 15px",
                        marginTop: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong>Grupo {g.grupo}</strong> — {g.horario}
                        <br />
                        Profesor: {g.docente} | Aula: {g.aula}
                        <br />
                        Cupos: {g.cupo}
                      </div>

                      {/* <button
        onClick={() => handleInscribirse(m.codigo, g.grupo)}
        style={{
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        Inscribir ({g.cupo} cupos)
      </button> */}
                      +      <InscribirMateria
                        registro={registro}
                        materiaCodigo={m.codigo}
                        grupo={g.grupo}
                      />
                    </div>
                  ))
                ) : (
                  <p>No hay grupos disponibles.</p>
                )}

              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
