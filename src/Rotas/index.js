import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../Paginas/login";
import Redefinir from "../Paginas/login/Redefinir";
import PageNotFound from "../Paginas/404";
import Medico from "../Paginas/medico";
import Gestor from "../Paginas/gestor";
import MedicoParceiro from "../Paginas/medico_parceiro";
import Telas from '../Paginas/atleta/Telas/telas';

const isAuthenticated = (requiredRole) => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // Serve para decodificar o token
    const tokenParts = token.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));
    
    return payload.role && payload.role === requiredRole; // Pega o role que está sendo retornado no back (loginControllers)
  } catch (error) {
    return false;
  }
};

const Rotas = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route
          path="/atleta/:email"
          element={isAuthenticated("Atleta") ? (
              <Telas />
            ) : (
              <Navigate to="*" replace />
            )
          }
        />
        <Route exact path="/redefinir" element={<Redefinir />} />
        <Route path="*" element={<PageNotFound />} />
        <Route
          path="/medico/:email"
          element={
            isAuthenticated("MÃ©dico") ? (
              <Medico />
            ) : (
              <Navigate to="*" replace />
            )
          }
        />
        <Route
          path="/gestor/:email"
          element={
            isAuthenticated("Gestor") ? (
              <Gestor />
            ) : (
              <Navigate to="*" replace />
            )
          }
        />
        <Route
          path="/medico-convidado/:email"
          element={
            isAuthenticated("MÃ©dico-Convidado") ? (
              <MedicoParceiro />
            ) : (
              <Navigate to="*" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Rotas;
