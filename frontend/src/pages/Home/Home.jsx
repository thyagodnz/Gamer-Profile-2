import { useEffect } from "react";
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
  IoHeartOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoTrophyOutline,
} from "react-icons/io5";
import { jogosIniciais } from "../../data/jogos";
import "./Home.css";

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
  const badgeLabel =
    jogo.status === "jogando"
      ? "JOGANDO"
      : jogo.status === "concluido"
        ? "CONCLUÍDO"
        : "DESEJO";

  return (
    <div className="game-card">
      <div className={`game-cover cover-${jogo.cor}`}>
        <span className={`game-badge badge-${jogo.status}`}>{badgeLabel}</span>
        <span className="cover-letter">{jogo.titulo.charAt(0)}</span>
        <span className="cover-dev">{jogo.desenvolvedora}</span>
      </div>

      <div className="game-info">
        <div className="game-title-row">
          <div>
            <h3 className="game-title">{jogo.titulo}</h3>
            <p className="game-genre">{jogo.genero}</p>
          </div>
          {jogo.status !== "desejo" && (
            <div className="game-stars">{renderEstrelas(jogo.avaliacao)}</div>
          )}
        </div>

        {jogo.status === "desejo" ? (
          <p className="wishlist-tag">
            <IoHeartOutline /> Na lista de desejos
          </p>
        ) : (
          <>
            <div className="progress-track">
              <div
                className={`progress-fill fill-${jogo.cor}`}
                style={{ width: `${jogo.progresso}%` }}
              />
            </div>
            <div className="game-meta">
              <span>{jogo.ultimaAtividade}</span>
              <span className={`meta-destaque texto-${jogo.cor}`}>
                {jogo.horasJogadas}h · {jogo.progresso}%
              </span>
            </div>
          </>
        )}
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

function Home({ usuarioLogado, onSair }) {
  const navigate = useNavigate();

  // rota protegida simples: sem login, volta para /login
  useEffect(() => {
    if (!usuarioLogado) {
      navigate("/login");
    }
  }, [usuarioLogado, navigate]);

  if (!usuarioLogado) return null;

  const jogos = jogosIniciais;
  const emAndamento = jogos.filter((j) => j.status === "jogando");
  const concluidos = jogos.filter((j) => j.status === "concluido");
  const totalHoras = jogos.reduce((soma, j) => soma + j.horasJogadas, 0);
  const totalConquistas = jogos.reduce((soma, j) => soma + j.conquistas, 0);

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
          <button className="btn-add-game" title="Em breve">
            <IoAddOutline size={18} /> Adicionar jogo
          </button>
        </div>

        <div className="stats-row">
          <StatCard
            icon={<IoGameControllerOutline size={20} />}
            valor={jogos.length}
            label="Jogos"
          />
          <StatCard
            icon={<IoTimeOutline size={20} />}
            valor={`${Math.round(totalHoras)}h`}
            label="Horas jogadas"
          />
          <StatCard
            icon={<IoCheckmarkCircleOutline size={20} />}
            valor={concluidos.length}
            label="Concluídos"
          />
          <StatCard
            icon={<IoTrophyOutline size={20} />}
            valor={totalConquistas}
            label="Conquistas"
          />
        </div>

        <section>
          <div className="section-header">
            <h2>
              <span className="bar bar-purple" />
              Em andamento
              <span className="section-count">
                ({emAndamento.length} jogos)
              </span>
            </h2>
          </div>
          <div className="games-grid">
            {emAndamento.map((jogo) => (
              <GameCard key={jogo.id} jogo={jogo} />
            ))}
          </div>
        </section>

        <section>
          <div className="section-header">
            <h2>
              <span className="bar bar-blue" />
              Minha Biblioteca
            </h2>
          </div>
          <div className="games-grid">
            {jogos.map((jogo) => (
              <GameCard key={jogo.id} jogo={jogo} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
