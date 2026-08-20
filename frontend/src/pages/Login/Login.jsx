import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  IoGameControllerOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { login } from "../../services/api.js";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setEntrando(true);
    try {
      const usuario = await login(email, senha);
      onLogin(usuario);
      navigate("/home");
    } catch (err) {
      setErro(err.message);
    } finally {
      setEntrando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="brand">
        <div className="brand-icon">
          <IoGameControllerOutline size={28} color="#c4b5fd" />
        </div>
        <h1 className="brand-title">Gamer Profile</h1>
        <p className="brand-subtitle">Sua biblioteca pessoal de jogos</p>
      </div>

      <div className="card">
        <h2>Entrar na conta</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              EMAIL
            </label>
            <input
              id="email"
              className="form-control"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="senha">
              SENHA
            </label>
            <div className="password-wrapper">
              <input
                id="senha"
                className="form-control"
                placeholder="••••••••"
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setMostrarSenha((v) => !v)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? (
                  <IoEyeOffOutline size={18} />
                ) : (
                  <IoEyeOutline size={18} />
                )}
              </button>
            </div>
          </div>

          <Link to="#" className="forgot-password">
            Esqueci a senha
          </Link>

          {erro && <p className="erro">{erro}</p>}

          <button type="submit" className="btn-primary" disabled={entrando}>
            {entrando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="divider">OU</div>

        <p className="signup-text">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
