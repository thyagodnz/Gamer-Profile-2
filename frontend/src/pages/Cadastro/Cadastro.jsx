import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  IoGameControllerOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { cadastrarUsuario } from "../../services/api.js";
import "./Cadastro.css";

function calcularForcaSenha(senha) {
  let forca = 0;
  if (senha.length >= 8) forca++;
  if (/[A-Z]/.test(senha)) forca++;
  if (/[0-9]/.test(senha)) forca++;
  if (/[^A-Za-z0-9]/.test(senha)) forca++;
  return forca;
}

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const forcaSenha = calcularForcaSenha(senha);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (!nome || !email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (senha.length < 8) {
      setErro("A senha deve ter no mínimo 8 caracteres.");
      return;
    }
    setEnviando(true);
    try {
      // Verificação de e-mail único agora é feita pelo backend
      // (retorna 409 se o e-mail já existir).
      await cadastrarUsuario({ nome, email, senha });
      navigate("/login");
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="brand">
        <div className="brand-icon">
          <IoGameControllerOutline size={28} color="#c4b5fd" />
        </div>
        <h1 className="brand-title">Gamer Profile</h1>
        <p className="brand-subtitle">Crie sua conta gratuita</p>
      </div>

      <div className="card">
        <h2>Criar nova conta</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="nome">
              NOME
            </label>
            <input
              id="nome"
              className="form-control"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

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
                placeholder="Mínimo 8 caracteres"
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
            <div className="password-strength">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`strength-bar ${
                    i <= forcaSenha ? `filled-${forcaSenha}` : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {erro && <p className="erro">{erro}</p>}

          <button type="submit" className="btn-primary" disabled={enviando}>
            {enviando ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <div className="divider">OU</div>

        <p className="signup-text">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
