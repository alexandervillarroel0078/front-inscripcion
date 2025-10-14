const API_BASE = "http://localhost:5001/api";


// ✅ Iniciar sesión y obtener token
export async function loginEstudiante(registro, password) {
  const res = await fetch(`${API_BASE}/estudiantes/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registro, password }),
  });

  if (!res.ok) {
    throw new Error("Registro o contraseña inválidos ❌");
  }

  const data = await res.json();
  // Guarda el token en localStorage para usarlo luego
  localStorage.setItem("token", data.token);
  return data;
}

// ✅ Obtener perfil del estudiante autenticado
export async function getPerfil() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token guardado. Inicia sesión primero.");

  const res = await fetch(`${API_BASE}/estudiantes/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener perfil o token inválido");
  return res.json();
}

// ==========================
// 🎓 INSCRIPCIONES
// ==========================

// ✅ Obtener materias disponibles de un estudiante
export async function getMateriasDisponibles(registro) {
  const res = await fetch(`${API_BASE}/inscripciones/materias-disponibles/${registro}`);
  if (!res.ok) throw new Error("Error al obtener materias disponibles");
  return res.json();
}

// ✅ Obtener grupos disponibles por materia
export async function getGruposPorMateria(materiaCodigo) {
  const res = await fetch(`${API_BASE}/inscripciones/grupos/${materiaCodigo}`);
  if (!res.ok) throw new Error("Error al obtener grupos de la materia");
  return res.json();
}

// ✅ Encolar inscripción (flujo asíncrono)
export async function inscribirse(dto) {
  const res = await fetch(`${API_BASE}/inscripciones/async`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al inscribirse: ${errorText}`);
  }

  return res.json();
}

// ✅ Consultar estado de inscripción del estudiante
export async function getEstadoInscripcion(registro) {
  const res = await fetch(`${API_BASE}/inscripciones/estado-inscripcion/${registro}`);
  if (!res.ok) throw new Error("Error al obtener estado de inscripción");
  return res.json();
}

// ✅ Consultar estado de la cola (opcional para debug)
export async function getQueueStatus() {
  const res = await fetch(`${API_BASE}/queue/status`);
  if (!res.ok) throw new Error("Error al consultar estado de la cola");
  return res.json();
}

// ✅ Consultar estado de una transacción de inscripción (nuevo endpoint)
export async function getEstadoTransaccionInscripcion(id) {
  const res = await fetch(`${API_BASE}/inscripciones/estado-transaccion/${id}`);
  if (!res.ok) throw new Error("Error al obtener estado de la transacción de inscripción");
  return res.json();
}
