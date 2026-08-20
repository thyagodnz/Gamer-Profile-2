// A URL vem de variável de ambiente; cai para a API em produção (Render) por padrão.
const API_URL = import.meta.env.VITE_API_URL || "https://gamerprofile.onrender.com";

async function request(path, options = {}) {
  const resp = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Respostas 204 (No Content) não têm corpo JSON.
  if (resp.status === 204) return null;

  let corpo = null;
  try {
    corpo = await resp.json();
  } catch {
    corpo = null;
  }

  if (!resp.ok) {
    const mensagem = corpo?.error || "Erro ao comunicar com o servidor.";
    throw new Error(mensagem);
  }

  return corpo;
}

// ===== Autenticação =====

export function login(email, senha) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

// ===== Usuários =====

export function listarUsuarios() {
  return request("/users");
}

export function cadastrarUsuario(dados) {
  return request("/users", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

// ===== Jogos (catálogo global) =====

export function listarJogos() {
  return request("/games");
}

export function criarJogo(dados) {
  return request("/games", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

// ===== Reviews =====
// Usadas como registro de "jogo na biblioteca" do usuário: cada review liga
// um userId a um gameId, com nota e comentário opcionais.

export function listarReviews() {
  return request("/reviews");
}

export function criarReview(dados) {
  return request("/reviews", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}
