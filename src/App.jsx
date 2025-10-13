import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Materias from "./pages/Materias";
import EstadoInscripcion from "./pages/EstadoInscripcion";
import GruposMateria from "./pages/GruposMateria";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/materias" element={<Materias />} />
        <Route path="/estado" element={<EstadoInscripcion />} />
        <Route path="/materias/:codigo" element={<GruposMateria />} />

      </Routes>
    </BrowserRouter>
  );
}
