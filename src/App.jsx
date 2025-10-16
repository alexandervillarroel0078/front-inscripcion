import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import InscripcionMaterias from "./pages/InscripcionMaterias";
import Estado from "./pages/Estado";
import HistorialInscripcion from "./pages/HistorialInscripcion";
import GruposMateria from "./pages/GruposMateria";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        
        <Route path="/materias" element={<InscripcionMaterias />} />

   
        <Route path="/estado/:id" element={<Estado />} />

        <Route path="/historial" element={<HistorialInscripcion />} />
        <Route path="/materias/:codigo" element={<GruposMateria />} />
      </Routes>
    </BrowserRouter>
  );
}
