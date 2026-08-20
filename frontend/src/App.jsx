import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Cadastro from "./pages/Cadastro/Cadastro.jsx";
import Login from "./pages/Login/Login.jsx";
import Home from "./pages/Home/Home.jsx";
import "./App.css";

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login onLogin={setUsuarioLogado} />} />
          <Route
            path="/home"
            element={
              <Home
                usuarioLogado={usuarioLogado}
                onSair={() => setUsuarioLogado(null)}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
