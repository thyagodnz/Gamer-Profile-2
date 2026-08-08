import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Cadastro from "./pages/Cadastro/Cadastro.jsx";
import Login from "./pages/Login/Login.jsx";
import Home from "./pages/Home/Home.jsx";
import { usuariosIniciais } from "./data/usuarios";
import "./App.css";

function App() {
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  function cadastrar(novo) {
    const proximoId = Math.max(0, ...usuarios.map((u) => u.id)) + 1;
    setUsuarios([...usuarios, { id: proximoId, ...novo }]);
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/cadastro"
            element={<Cadastro usuarios={usuarios} onCadastrar={cadastrar} />}
          />
          <Route
            path="/login"
            element={<Login usuarios={usuarios} onLogin={setUsuarioLogado} />}
          />
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
