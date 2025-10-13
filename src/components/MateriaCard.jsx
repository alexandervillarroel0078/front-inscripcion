export default function MateriaCard({ grupo, onInscribirse }) {
  const sinCupo = grupo.cupo <= 0;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        border: sinCupo ? "1.5px solid #d32f2f" : "1.5px solid #e0e0e0",
      }}
    >
      <h2
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#1a237e",
          marginBottom: "8px",
        }}
      >
        {grupo.materia.nombre}
      </h2>

      <p><strong>Código:</strong> {grupo.materia.codigo}</p>
      <p><strong>Grupo:</strong> {grupo.grupo}</p>
      <p><strong>Cupo:</strong> {grupo.cupo}</p>
      <p><strong>Docente:</strong> {grupo.docente?.nombre}</p>
      <p>
        <strong>Horario:</strong>{" "}
        {grupo.horario?.dia} {grupo.horario?.horaInicio} -{" "}
        {grupo.horario?.horaFin}
      </p>
      <p><strong>Aula:</strong> {grupo.aula?.codigo}</p>

      <button
        onClick={onInscribirse}
        disabled={sinCupo}
        style={{
          backgroundColor: sinCupo ? "#ccc" : "#1a237e",
          color: "#fff",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: sinCupo ? "not-allowed" : "pointer",
          marginTop: "10px",
        }}
      >
        {sinCupo ? "Sin cupo" : "Inscribirse"}
      </button>
    </div>
  );
}
