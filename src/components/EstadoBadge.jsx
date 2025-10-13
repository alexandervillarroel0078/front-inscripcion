import React from "react";

export default function EstadoBadge({ estado }) {
  const color =
    estado === "CONFIRMADO"
      ? "green"
      : estado === "RECHAZADO"
      ? "red"
      : "orange";

  return <span className="badge" style={{ backgroundColor: color }}>{estado}</span>;
}
