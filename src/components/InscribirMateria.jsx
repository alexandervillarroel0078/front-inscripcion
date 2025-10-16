// import React, { useState } from "react";
// import { inscribirse, getEstadoTransaccionInscripcion } from "../api";

// export default function InscribirMateria({ registro, materiaCodigo, grupo }) {
//   const [mensaje, setMensaje] = useState("");
//   const [estado, setEstado] = useState("idle");
//   const [txId, setTxId] = useState(null);

//   const handleInscribirse = async () => {
//     setEstado("loading");
//     setMensaje("🕓 Procesando... Enviando solicitud...");

//     try {
//       // 🔹 Paso 1: Enviar inscripción
//       const res = await inscribirse({
//         registro,
//         periodoId: 1,
//         materias: [{ materiaCodigo, grupo }],
//       });

//       setTxId(res.transactionId);
//       setMensaje(`📦 Solicitud encolada (ID: ${res.transactionId.slice(0, 8)}...)`);
//       setEstado("pending");

//       // 🔁 Paso 2: Polling cada 5 segundos con límite de tiempo
//       let attempts = 0;
//       const maxAttempts = 8; // 8 * 5s = 40 segundos
//       const interval = setInterval(async () => {
//         attempts++;
// Q
//         try {
//           const data = await getEstadoTransaccionInscripcion(res.transactionId);
//           if (!data || !data.estadoInscripcion) return;

//           const estadoInsc = data.estadoInscripcion?.toUpperCase();

//           if (estadoInsc === "CONFIRMADA") {
//             setEstado("success");
//             setMensaje(`✅ Confirmado: Inscripción completada (ID: ${data.id.slice(0, 8)}...)`);
//             clearInterval(interval);
//           } else if (estadoInsc === "RECHAZADA") {
//             setEstado("error");
//             setMensaje(`❌ Rechazado: Sin cupos o error de inscripción (ID: ${data.id.slice(0, 8)}...)`);
//             clearInterval(interval);
//           } else if (estadoInsc === "PARCIAL") {
//             setEstado("pending");
//             setMensaje("⚠️ Parcial: Algunas materias sin cupo todavía...");
//           } else {
//             setMensaje(`⌛ Estado actual: ${estadoInsc}...`);
//           }
//         } catch (err) {
//           setMensaje("⚠️ Error de conexión. Reintentando...");
//         }

//         // ⏱️ Si pasa el tiempo máximo, cancelar
//         if (attempts >= maxAttempts) {
//           clearInterval(interval);
//           setEstado("timeout");
//           setMensaje(
//             `⏰ Sin respuesta del servidor después de ${maxAttempts * 5}s (ID: ${res.transactionId.slice(0, 8)}...)`
//           );
//         }
//       }, 5000);
//     } catch (err) {
//       setEstado("error");
//       setMensaje("💥 Error al enviar solicitud.");
//     }
//   };

//   // 🔹 Reactivar botón después de error o timeout
//   const puedeReintentar = ["error", "timeout", "network-error"].includes(estado);

//   // 🔹 Spinner animado simple
//   const Spinner = () => (
//     <div
//       style={{
//         width: "18px",
//         height: "18px",
//         border: "2px solid #fff",
//         borderTop: "2px solid rgba(255,255,255,0.3)",
//         borderRadius: "50%",
//         marginRight: "6px",
//         animation: "spin 1s linear infinite",
//       }}
//     />
//   );

//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
//       <button
//         onClick={handleInscribirse}
//         disabled={
//           estado === "loading" ||
//           estado === "pending" ||
//           estado === "success"
//         }
//         style={{
//           background:
//             estado === "success"
//               ? "green"
//               : estado === "error" || estado === "timeout"
//               ? "red"
//               : estado === "pending"
//               ? "orange"
//               : "#007bff",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           padding: "8px 12px",
//           cursor: puedeReintentar ? "pointer" : "default",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: "5px",
//           transition: "background 0.3s",
//         }}
//       >
//         {(estado === "loading" || estado === "pending") && <Spinner />}
//         {estado === "loading" || estado === "pending"
//           ? "Procesando..."
//           : puedeReintentar
//           ? "Reintentar"
//           : "Inscribirse"}
//       </button>

//       {mensaje && (
//         <small
//           style={{
//             marginTop: "6px",
//             color:
//               estado === "success"
//                 ? "green"
//                 : estado === "error" || estado === "timeout"
//                 ? "red"
//                 : estado === "pending"
//                 ? "orange"
//                 : "#555",
//             fontWeight: "bold",
//           }}
//         >
//           {mensaje}
//         </small>
//       )}

//       {/* Animación CSS inline */}
//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 agregado
import { inscribirse, getEstadoTransaccionInscripcion } from "../api";

export default function InscribirMateria({ registro, materiaCodigo, grupo }) {
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState("idle");
  const [txId, setTxId] = useState(null);
  const navigate = useNavigate(); // 👈 agregado

  const handleInscribirse = async () => {
    setEstado("loading");
    setMensaje("🕓 Procesando... Enviando solicitud...");

    try {
      // 🔹 Paso 1: Enviar inscripción
      const res = await inscribirse({
        registro,
        periodoId: 1,
        materias: [{ materiaCodigo, grupo }],
      });

      setTxId(res.transactionId);
      setMensaje(`📦 Solicitud encolada (ID: ${res.transactionId.slice(0, 8)}...)`);
      setEstado("pending");

      // 👇 Redirigir a la pantalla de estado
      navigate(`/estado/${res.transactionId}`);

      // 🔁 Paso 2: Polling cada 5 segundos con límite de tiempo
      let attempts = 0;
      const maxAttempts = 8; // 8 * 5s = 40 segundos
      const interval = setInterval(async () => {
        attempts++;

        try {
          const data = await getEstadoTransaccionInscripcion(res.transactionId);
          if (!data || !data.estadoInscripcion) return;

          const estadoInsc = data.estadoInscripcion?.toUpperCase();

          if (estadoInsc === "CONFIRMADA") {
            setEstado("success");
            setMensaje(`✅ Confirmado: Inscripción completada (ID: ${data.id.slice(0, 8)}...)`);
            clearInterval(interval);
          } else if (estadoInsc === "RECHAZADA") {
            setEstado("error");
            setMensaje(`❌ Rechazado: Sin cupos o error de inscripción (ID: ${data.id.slice(0, 8)}...)`);
            clearInterval(interval);
          } else if (estadoInsc === "PARCIAL") {
            setEstado("pending");
            setMensaje("⚠️ Parcial: Algunas materias sin cupo todavía...");
          } else {
            setMensaje(`⌛ Estado actual: ${estadoInsc}...`);
          }
        } catch (err) {
          setMensaje("⚠️ Error de conexión. Reintentando...");
        }

        // ⏱️ Si pasa el tiempo máximo, cancelar
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setEstado("timeout");
          setMensaje(
            `⏰ Sin respuesta del servidor después de ${maxAttempts * 5}s (ID: ${res.transactionId.slice(0, 8)}...)`
          );
        }
      }, 5000);
    } catch (err) {
      setEstado("error");
      setMensaje("💥 Error al enviar solicitud.");
    }
  };

  // 🔹 Reactivar botón después de error o timeout
  const puedeReintentar = ["error", "timeout", "network-error"].includes(estado);

  // 🔹 Spinner animado simple
  const Spinner = () => (
    <div
      style={{
        width: "18px",
        height: "18px",
        border: "2px solid #fff",
        borderTop: "2px solid rgba(255,255,255,0.3)",
        borderRadius: "50%",
        marginRight: "6px",
        animation: "spin 1s linear infinite",
      }}
    />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <button
        onClick={handleInscribirse}
        disabled={
          estado === "loading" ||
          estado === "pending" ||
          estado === "success"
        }
        style={{
          background:
            estado === "success"
              ? "green"
              : estado === "error" || estado === "timeout"
              ? "red"
              : estado === "pending"
              ? "orange"
              : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "8px 12px",
          cursor: puedeReintentar ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "5px",
          transition: "background 0.3s",
        }}
      >
        {(estado === "loading" || estado === "pending") && <Spinner />}
        {estado === "loading" || estado === "pending"
          ? "Procesando..."
          : puedeReintentar
          ? "Reintentar"
          : "Inscribirse"}
      </button>

      {mensaje && (
        <small
          style={{
            marginTop: "6px",
            color:
              estado === "success"
                ? "green"
                : estado === "error" || estado === "timeout"
                ? "red"
                : estado === "pending"
                ? "orange"
                : "#555",
            fontWeight: "bold",
          }}
        >
          {mensaje}
        </small>
      )}

      {/* Animación CSS inline */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
