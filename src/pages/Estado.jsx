import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEstadoTransaccionInscripcion } from "../api";

export default function Estado() {
  const { id } = useParams(); // 🆔 TransactionId desde la URL
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState("pending");
  const [intentos, setIntentos] = useState(0);

  useEffect(() => {
    if (!id) return;

    setMensaje(`📦 Consultando estado de la transacción (ID: ${id.slice(0, 8)}...)`);
    setEstado("pending");

    let attempts = 0;
    const maxAttempts = 8; // 8 * 5s = 40 segundos

    const interval = setInterval(async () => {
      attempts++;
      setIntentos(attempts);

      try {
        const data = await getEstadoTransaccionInscripcion(id);
        if (!data || !data.estadoInscripcion) return;

        const estadoInsc = data.estadoInscripcion?.toUpperCase();

        // if (estadoInsc === "CONFIRMADA") {
        //   setEstado("success");
        //   setMensaje(`✅ Confirmado: Inscripción completada (ID: ${data.id.slice(0, 8)}...)`);
        //   clearInterval(interval);
        //   // } else if (estadoInsc === "RECHAZADA") {
        //   //   setEstado("error");
        //   //   setMensaje(`❌ Rechazado: Sin cupos o error de inscripción (ID: ${data.id.slice(0, 8)}...)`);
        //   //   clearInterval(interval);
        // } else if (estadoInsc === "RECHAZADA") {
        //   setEstado("error");

        //   // Si el backend envía mensajeError, úsalo, sino muestra el mensaje genérico
        //   const mensajeError =
        //     data.mensajeError || "Sin cupos o error de inscripción";

        //   setMensaje(`❌ ${mensajeError} (ID: ${data.id?.slice(0, 8)}...)`);
        //   clearInterval(interval);

        // } else if (estadoInsc === "PARCIAL") {
        //   setEstado("pending");
        //   setMensaje("⚠️ Parcial: Algunas materias sin cupo todavía...");
        // } else {
        //   setMensaje(`⌛ Estado actual: ${estadoInsc}...`);
        // }
        if (estadoInsc === "CONFIRMADA") {
  setEstado("success");
  setMensaje(`✅ Confirmado: Inscripción completada (ID: ${data.id.slice(0, 8)}...)`);
  clearInterval(interval);
} else if (estadoInsc === "RECHAZADA") {
  setEstado("error");
  const mensajeError =
    data.mensajeError || "Sin cupos o error de inscripción";
  setMensaje(`❌ ${mensajeError} (ID: ${data.id?.slice(0, 8)}...)`);
  clearInterval(interval);
} else if (estadoInsc === "PARCIAL") {
  setEstado("warning");
  const mensajeError = data.mensajeError
    ? `⚠️ Parcial: ${data.mensajeError}`
    : "⚠️ Parcial: algunas materias no pudieron inscribirse.";
  setMensaje(mensajeError);
  clearInterval(interval);
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
        setMensaje(`⏰ Sin respuesta del servidor después de ${maxAttempts * 5}s.`);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  // 🔹 Spinner animado simple
  const Spinner = () => (
    <div
      style={{
        width: "24px",
        height: "24px",
        border: "3px solid #ccc",
        borderTop: "3px solid #007bff",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Segoe UI, sans-serif",
        background: "#f4f6f8",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          padding: "30px",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "15px", color: "#333" }}>
          Estado de tu Inscripción
        </h2>

        <p
          style={{
            fontSize: "0.9rem",
            color: "#777",
            marginBottom: "10px",
          }}
        >
          🆔 Transacción: {id}
        </p>

        {estado === "pending" && (
          <>
            <Spinner />
            <p
              style={{
                marginTop: "15px",
                color: "#555",
                fontWeight: "bold",
              }}
            >
              {mensaje || "⌛ Procesando..."}
            </p>
            <p style={{ fontSize: "0.85rem", color: "#888" }}>
              Intento {intentos} de 8...
            </p>
          </>
        )}

        {estado === "success" && (
          <p
            style={{
              background: "#2ecc71",
              color: "#fff",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            {mensaje}
          </p>
        )}

        {estado === "error" && (
          <p
            style={{
              background: "#e74c3c",
              color: "#fff",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            {mensaje}
          </p>
        )}

        {estado === "timeout" && (
          <p
            style={{
              background: "#f39c12",
              color: "#fff",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            {mensaje}
          </p>
        )}

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "25px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 15px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ⬅ Volver al Inicio
        </button>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
