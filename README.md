# 🎮 Gamer Profile — Frontend

Aplicação web para gerenciar sua biblioteca pessoal de jogos: cadastro e login de usuários, catálogo de jogos e avaliações (notas/comentários) associadas a cada jogo da sua biblioteca.

Projeto desenvolvido para a disciplina de **Programação Web**, do curso de **Ciência da Computação**.

## ✨ Funcionalidades

- Cadastro e login de usuários (autenticado contra a API)
- Listagem de todos os usuários cadastrados
- Biblioteca pessoal de jogos: adicionar um jogo (criando-o no catálogo, se ainda não existir) e avaliá-lo com nota (1 a 5 estrelas) e comentário
- Estatísticas rápidas: total de jogos na biblioteca, avaliação média, jogos no catálogo e usuários cadastrados

## 🛠️ Tecnologias

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/) — build tool e dev server
- [React Router](https://reactrouter.com/) — rotas (`/login`, `/cadastro`, `/home`)
- [react-icons](https://react-icons.github.io/react-icons/) — ícones (Ionicons 5)
- CSS puro (um arquivo `.css` por página/componente, sem framework de UI)

## 🔗 Backend

Este frontend consome a **Gamer Profile API**, uma API REST (Node.js + Express + SQLite) com rotas para usuários, jogos e reviews. Por padrão, a aplicação aponta para a API já em produção no Render; veja [Variáveis de ambiente](#-variáveis-de-ambiente) para apontar para uma instância local.

Rotas consumidas pelo frontend:

| Método | Rota           | Uso                                                   |
| ------ | -------------- | ------------------------------------------------------ |
| POST   | `/auth/login`  | Autenticar usuário (e-mail + senha)                    |
| GET    | `/users`       | Listar todos os usuários cadastrados                   |
| POST   | `/users`       | Cadastrar um novo usuário                               |
| GET    | `/games`       | Listar o catálogo de jogos                              |
| POST   | `/games`       | Cadastrar um jogo novo no catálogo                      |
| GET    | `/reviews`     | Listar todas as reviews (usadas como "jogo na biblioteca") |
| POST   | `/reviews`     | Criar uma review, vinculando um jogo à biblioteca do usuário |

> **Nota:** o banco de dados da API não possui uma tabela própria de "biblioteca do usuário" — cada *review* (`userId` + `gameId` + `nota` + `comentario`) é o que representa um jogo estar na biblioteca de alguém. Por isso, campos como progresso, horas jogadas e status ("jogando"/"concluído") não existem nesta versão.

## 📁 Estrutura de pastas

```
src/
├── pages/
│   ├── Login/          # Tela de login
│   ├── Cadastro/        # Tela de cadastro de conta
│   └── Home/            # Dashboard: biblioteca, usuários e "adicionar jogo"
├── services/
│   └── api.js           # Funções de acesso à API (fetch)
├── App.jsx               # Rotas da aplicação
└── main.jsx               # Ponto de entrada (Vite/React)
```

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm (instalado junto com o Node.js)

### Passo a passo

1. Clone o repositório:

   ```bash
   git clone https://github.com/thyagodnz/Gamer-Profile-2.git
   cd frontend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. (Opcional) Configure a variável de ambiente — veja a seção abaixo. Se você pular esta etapa, a aplicação já vai usar a API em produção no Render.

4. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse [http://localhost:5173](http://localhost:5173) no navegador.

## ⚙️ Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto para customizar a URL da API (por exemplo, para apontar para uma instância local do backend):

```env
VITE_API_URL=http://localhost:3000
```

Se a variável não for definida, o frontend usa por padrão a API em produção:
`https://gamerprofile.onrender.com`

> ⚠️ Se for usar uma API local, lembre-se de rodar o backend correspondente (`npm run dev` na pasta do backend) e garantir que ele libera CORS para `http://localhost:5173`.

## 📜 Scripts disponíveis

| Comando           | Descrição                                          |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento (Vite)          |
| `npm run build`   | Gera a build de produção na pasta `dist/`            |
| `npm run preview` | Serve localmente a build de produção gerada          |
| `npm run lint`    | Executa o ESLint no projeto                          |

## 📌 Observações

- Este projeto não possui persistência de sessão (ex.: `localStorage`): ao recarregar a página, é necessário fazer login novamente.
- Todas as validações de dados obrigatórios (e-mail único, campos obrigatórios etc.) são feitas pelo backend; o frontend apenas exibe a mensagem de erro retornada pela API.

