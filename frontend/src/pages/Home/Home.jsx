import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  IoGameControllerOutline,
  IoSearchOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoAddOutline,
  IoStar,
  IoStarOutline,
  IoPeopleOutline,
  IoLibraryOutline,
  IoSparklesOutline,
  IoClose,
} from "react-icons/io5";
import {
  listarUsuarios,
  listarJogos,
  listarReviews,
  criarJogo,
  criarReview,
} from "../../services/api.js";
import "./Home.css";

// Paleta de cores dos cards: como o catálogo não guarda uma "cor" própria,
// escolhemos uma de forma determinística a partir do título do jogo — assim
// o mesmo jogo sempre cai na mesma cor, sem precisar salvar isso no banco.
const CORES = ["vermelho", "laranja", "azul", "verde"];
function corPorTitulo(titulo) {
  const soma = [...titulo].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CORES[soma % CORES.length];
}

function renderEstrelas(nota) {
  return [1, 2, 3, 4, 5].map((i) =>
    i <= nota ? (
      <IoStar key={i} className="estrela estrela-cheia" />
    ) : (
      <IoStarOutline key={i} className="estrela" />
    ),
  );
}

function GameCard({ jogo }) {
  const cor = corPorTitulo(jogo.titulo);
  return (
    <div className="game-card">
      <div className={`game-cover cover-${cor}`}>
        <span className="cover-letter">{jogo.titulo.charAt(0)}</span>
        <span className="cover-dev">{jogo.genero}</span>
      </div>

      <div className="game-info">
        <div className="game-title-row">
          <div>
            <h3 className="game-title">{jogo.titulo}</h3>
            <p className="game-genre">{jogo.dataLancamento}</p>
          </div>
          <div className="game-stars">{renderEstrelas(jogo.nota || 0)}</div>
        </div>

        {jogo.comentario && <p className="game-comment">“{jogo.comentario}”</p>}
      </div>
    </div>
  );
}

function StatCard({ icon, valor, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p className="stat-value">{valor}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

const JOGO_VAZIO = {
  titulo: "",
  genero: "",
  descricao: "",
  dataLancamento: "",
  nota: 0,
  comentario: "",
};

function Home({ usuarioLogado, onSair }) {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [novoJogo, setNovoJogo] = useState(JOGO_VAZIO);
  const [erroModal, setErroModal] = useState("");
  const [salvando, setSalvando] = useState(false);

  // rota protegida simples: sem login, volta para /login
  useEffect(() => {
    if (!usuarioLogado) {
      navigate("/login");
    }
  }, [usuarioLogado, navigate]);

  // Busca os dados reais da API assim que sabemos quem está logado.
  useEffect(() => {
    if (!usuarioLogado) return;
    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErroCarregamento("");
      try {
        const [usuariosResp, jogosResp, reviewsResp] = await Promise.all([
          listarUsuarios(),
          listarJogos(),
          listarReviews(),
        ]);
        if (!cancelado) {
          setUsuarios(usuariosResp);
          setJogos(jogosResp);
          setReviews(reviewsResp);
        }
      } catch (err) {
        if (!cancelado) setErroCarregamento(err.message);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [usuarioLogado]);

  if (!usuarioLogado) return null;

  // "Minha Biblioteca" = jogos do catálogo que têm uma review minha ligando-os a mim.
  const minhaBiblioteca = reviews
    .filter((r) => r.userId === usuarioLogado.id)
    .map((r) => {
      const jogo = jogos.find((j) => j.id === r.gameId);
      return jogo
        ? { ...jogo, nota: r.nota, comentario: r.comentario, reviewId: r.id }
        : null;
    })
    .filter(Boolean);

  const notasValidas = minhaBiblioteca
    .map((j) => j.nota)
    .filter((nota) => Number(nota) > 0);
  const avaliacaoMedia = notasValidas.length
    ? (notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length).toFixed(1)
    : "—";

  function abrirModal() {
    setNovoJogo(JOGO_VAZIO);
    setErroModal("");
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
  }

  async function handleAdicionarJogo(e) {
    e.preventDefault();
    setErroModal("");

    const { titulo, genero, descricao, dataLancamento, nota, comentario } =
      novoJogo;

    if (!titulo.trim() || !genero.trim() || !descricao.trim() || !dataLancamento) {
      setErroModal("Preencha título, gênero, descrição e data de lançamento.");
      return;
    }

    setSalvando(true);
    try {
      // Reaproveita o jogo se ele já existir no catálogo (mesmo título);
      // senão, cadastra um jogo novo antes de vincular ao usuário.
      let jogo = jogos.find(
        (j) => j.titulo.trim().toLowerCase() === titulo.trim().toLowerCase(),
      );

      if (!jogo) {
        jogo = await criarJogo({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          genero: genero.trim(),
          dataLancamento,
        });
        setJogos((atual) => [...atual, jogo]);
      }

      const novaReview = await criarReview({
        userId: usuarioLogado.id,
        gameId: jogo.id,
        comentario: comentario.trim() || "Adicionado à biblioteca.",
        nota: nota || null,
      });

      setReviews((atual) => [...atual, novaReview]);
      fecharModal();
    } catch (err) {
      setErroModal(err.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-icon-sm">
              <IoGameControllerOutline size={20} color="#c4b5fd" />
            </div>
            <span>Gamer Profile</span>
          </div>

          <div className="header-search">
            <IoSearchOutline />
            <input placeholder="Buscar jogo..." readOnly />
          </div>

          <div className="header-actions">
            <button className="icon-btn" title="Notificações (em breve)">
              <IoNotificationsOutline size={18} />
            </button>
            <button className="icon-btn" title="Configurações (em breve)">
              <IoSettingsOutline size={18} />
            </button>
            <div className="user-chip">
              <div className="user-avatar">
                {usuarioLogado.nome.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">
                {usuarioLogado.nome.split(" ")[0]}
              </span>
            </div>
            <button
              className="icon-btn"
              title="Sair"
              onClick={() => {
                onSair();
                navigate("/login");
              }}
            >
              <IoLogOutOutline size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="home-content">
        <div className="welcome-row">
          <div>
            <p className="welcome-eyebrow">BEM-VINDO DE VOLTA</p>
            <h1 className="welcome-name">{usuarioLogado.nome}</h1>
          </div>
          <button className="btn-add-game" onClick={abrirModal}>
            <IoAddOutline size={18} /> Adicionar jogo
          </button>
        </div>

        {erroCarregamento && (
          <p className="erro erro-pagina">{erroCarregamento}</p>
        )}

        {carregando ? (
          <p className="carregando">Carregando seus dados...</p>
        ) : (
          <>
            <div className="stats-row">
              <StatCard
                icon={<IoLibraryOutline size={20} />}
                valor={minhaBiblioteca.length}
                label="Meus jogos"
              />
              <StatCard
                icon={<IoStar size={20} />}
                valor={avaliacaoMedia}
                label="Avaliação média"
              />
              <StatCard
                icon={<IoSparklesOutline size={20} />}
                valor={jogos.length}
                label="Jogos no catálogo"
              />
              <StatCard
                icon={<IoPeopleOutline size={20} />}
                valor={usuarios.length}
                label="Usuários cadastrados"
              />
            </div>

            <section>
              <div className="section-header">
                <h2>
                  <span className="bar bar-purple" />
                  Minha Biblioteca
                  <span className="section-count">
                    ({minhaBiblioteca.length} jogos)
                  </span>
                </h2>
              </div>
              {minhaBiblioteca.length === 0 ? (
                <p className="vazio">
                  Você ainda não adicionou nenhum jogo. Clique em "Adicionar
                  jogo" para começar sua biblioteca.
                </p>
              ) : (
                <div className="games-grid">
                  {minhaBiblioteca.map((jogo) => (
                    <GameCard key={jogo.reviewId} jogo={jogo} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="section-header">
                <h2>
                  <span className="bar bar-blue" />
                  Usuários cadastrados
                  <span className="section-count">({usuarios.length})</span>
                </h2>
              </div>
              <div className="users-list">
                {usuarios.map((u) => (
                  <div className="user-row" key={u.id}>
                    <div className="user-avatar">
                      {u.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="user-row-name">
                        {u.nome}
                        {u.id === usuarioLogado.id && (
                          <span className="voce-tag">você</span>
                        )}
                      </p>
                      <p className="user-row-email">{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {modalAberto && (
        <div className="modal-backdrop" onClick={fecharModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adicionar jogo</h2>
              <button className="icon-btn" onClick={fecharModal}>
                <IoClose size={18} />
              </button>
            </div>

            <form onSubmit={handleAdicionarJogo}>
              <div className="form-group">
                <label className="form-label">TÍTULO</label>
                <input
                  className="form-control"
                  placeholder="Ex.: Hollow Knight"
                  value={novoJogo.titulo}
                  onChange={(e) =>
                    setNovoJogo({ ...novoJogo, titulo: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">GÊNERO</label>
                <input
                  className="form-control"
                  placeholder="Ex.: Metroidvania"
                  value={novoJogo.genero}
                  onChange={(e) =>
                    setNovoJogo({ ...novoJogo, genero: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">DESCRIÇÃO</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Uma breve descrição do jogo"
                  value={novoJogo.descricao}
                  onChange={(e) =>
                    setNovoJogo({ ...novoJogo, descricao: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">DATA DE LANÇAMENTO</label>
                <input
                  type="date"
                  className="form-control"
                  value={novoJogo.dataLancamento}
                  onChange={(e) =>
                    setNovoJogo({
                      ...novoJogo,
                      dataLancamento: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">SUA NOTA</label>
                <div className="star-picker">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      type="button"
                      key={i}
                      className="star-picker-btn"
                      onClick={() => setNovoJogo({ ...novoJogo, nota: i })}
                      aria-label={`${i} estrela(s)`}
                    >
                      {i <= novoJogo.nota ? (
                        <IoStar className="estrela estrela-cheia" />
                      ) : (
                        <IoStarOutline className="estrela" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">COMENTÁRIO (OPCIONAL)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="O que achou do jogo?"
                  value={novoJogo.comentario}
                  onChange={(e) =>
                    setNovoJogo({ ...novoJogo, comentario: e.target.value })
                  }
                />
              </div>

              {erroModal && <p className="erro">{erroModal}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={salvando}
                >
                  {salvando ? "Salvando..." : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
