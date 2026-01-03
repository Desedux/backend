🧠 Sobre o Desedux

Uma plataforma desenvolvida para melhorar a comunicação entre alunos e professores universitários.

📘 O Projeto

O Desedux é um projeto acadêmico desenvolvido pelos alunos de Ciência da Computação da Newton Paiva, no curso de Engenharia de Software.

Nossa missão é resolver um problema comum no ambiente universitário: a dificuldade de comunicação entre alunos e professores.
Muitas vezes, dúvidas importantes ficam sem resposta, informações importantes não chegam a todos os estudantes, e o diálogo entre a comunidade acadêmica é fragmentado.

Com o Desedux, criamos um espaço centralizado onde alunos podem fazer perguntas, compartilhar conhecimento e receber respostas oficiais da instituição.
A plataforma promove transparência, colaboração e facilita o acesso à informação para toda a comunidade universitária.

# Desedux - Backend

---

## Sumário

* [Stack](#stack)
* [Pré-requisitos](#pré-requisitos)
* [Instalação](#instalação)
* [Configuração de ambiente](#configuração-de-ambiente)
* [Banco de dados](#banco-de-dados)
* [Executando](#executando)
* [Scripts úteis](#scripts-úteis)
* [Rotas da API](#rotas-da-api)

    * [Health](#health)
    * [Auth e User](#auth-e-user)
    * [Tags](#tags)
    * [Cards](#cards)
    * [Comentários](#comentários)
* [Modelo de dados](#modelo-de-dados)
* [Boas práticas e notas](#boas-práticas-e-notas)
* [Licença](#licença)

---

## Stack

* Node 24.11.0
* NestJS + TypeScript
* PostgreSQL
* Redis (cache de contagem de tags e códigos)
* Sequelize ORM 6.37.x + sequelize-typescript
* Sequelize CLI 6.6.x
* Swagger/OpenAPI

---

## Pré-requisitos

* Node 24.11.0 e npm 10+
* PostgreSQL 14+
* Redis 7+ (cache de contagem de tags e armazenamento de códigos de verificação)
* Firebase: API Key para REST + credenciais de service account para o Admin SDK
* Conta de e-mail (transporter configurado para Gmail) com senha de app para envio dos códigos de verificação/recuperação

---

## Instalação

```bash
# 1) Clonar
git clone https://github.com/Desedux/backend.git
cd backend

# 2) Instalar dependências
npm ci
```

---

## Configuração de ambiente

Crie um arquivo `.env` na raiz. O app lê essas variáveis para Firebase, banco, Redis e e-mail (valores entre parênteses são defaults).

```ini
PORT=3001
FRONTEND_URL=http://localhost:3000

# Firebase
FIREBASE_API_KEY=your_firebase_api_key
# JSON completo da service account do Firebase Admin em uma única linha
FIREBASE_ADMIN_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\nABC...XYZ\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk@seu-projeto.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40seu-projeto.iam.gserviceaccount.com"}

# E-mail (Gmail por padrão via Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=secretpassword
POSTGRES_DB=mydatabase

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

Observações rápidas:

* `FIREBASE_ADMIN_CREDENTIALS` deve conter o JSON da service account. Mantenha as quebras de linha do `private_key` com `\n`.
* `FRONTEND_URL` define a origem liberada no CORS (padrão `http://localhost:3000`) e `PORT` define a porta da API (padrão `3001`).
* O transporter de e-mail usa `service: 'gmail'`; se usar outro provedor, ajuste a configuração em `EmailService`.
* Redis é usado para guardar códigos de verificação/recuperação e cache de contagem de tags; se as variáveis não forem definidas, usa `localhost:6379`.

---

## Banco de dados

O app (SequelizeModule) lê `POSTGRES_*` do `.env` com fallback `admin/secretpassword@localhost:5432/mydatabase`. O `sequelize-cli` usa `.sequelizerc` apontando para `src/database/config.js`.

Passos locais:

```bash
# Subir dependências (Postgres + Redis)
docker-compose up -d postgres redis

# Criar o banco, se ainda não existir
psql -h 127.0.0.1 -U postgres -c "CREATE DATABASE mydatabase;"

# Migrar e popular
npm run db:migrate          # ou npx sequelize-cli db:migrate
npm run db:seed             # ou npx sequelize-cli db:seed:all
```

Se usar host/credenciais diferentes, ajuste as variáveis `POSTGRES_*` ou edite `src/database/config.js`.

---

## Executando

```bash
# Desenvolvimento com reload
npm run start:dev

# Produção
npm run build
npm run start:prod
```

Swagger UI: [http://localhost:3001/api](http://localhost:3001/api) (ativo apenas se `NODE_ENV` for diferente de `production`)
> Porta padrão `3001` (configurável via `PORT`).

---

## Scripts úteis

```bash
# Lint
npm run lint

# Testes
npm test

# Migrações e seeds
npm run db:migrate
npm run db:migrate:undo:all
npm run db:seed
npm run db:seed:undo
```

---

## Rotas da API

Headers comuns:

```
Content-Type: application/json
Authorization: Bearer <ID_TOKEN>   # obrigatório nas rotas protegidas
```

### Health

* **GET `/`** — Retorna status, uptime no formato `0h1m2s` e timestamp ISO.

Exemplo:

```json
{
  "status": "ok",
  "message": "API is running",
  "uptime": "0h1m2s",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### Auth

* **POST `/auth/login`** — Body `{ "email": "...", "password": "..." }`. Usa Firebase e retorna `{ idToken, refreshToken, expiresIn }`.
* **POST `/auth/refresh`** — Body `{ "refreshToken": "..." }`. Retorna tokens atualizados.

### User

* **POST `/user/verification-token`** — Envia código de 5 dígitos para criar conta (e-mails `@alunos`/`@professores`). Usa Redis para limitar tentativas.
* **POST `/user/refactor-token`** — Envia código de recuperação de senha para o mesmo domínio institucional.
* **POST `/user/register`** — Body `{ firstName, token, email, password }`. Requer código de verificação; cria usuário no Firebase e registra no banco com role derivada do domínio.
* **PATCH `/user/change-password`** — Body `{ email, token, newPassword }`. Usa o código recebido em `/user/refactor-token`.
* **GET `/user/profile`** (autenticado) — Retorna o payload do `verifyIdToken` do Firebase.

### Tags

* **GET `/tags`** — Lista tags com contagem de cards ativos (`count`). Não requer autenticação.

### Cards

* **GET `/card?page=1`** — Lista cards ativos, 20 por página, ordenados por `up_down DESC`. Se houver token, inclui `user_vote`.
* **GET `/card/detail/:id`** — Detalhe do card (inclui `user_vote` se houver token).
* **GET `/card/tag/:category?page=1`** — Cards filtrados pelo id da tag.
* **POST `/card`** (autenticado) — Cria card. Body `{ title, description, isAnonymous, tags: [1, 2] }`. Define `author` como "Anônimo" se solicitado; caso contrário usa `displayName` do Firebase.
* **PATCH `/card`** (autenticado) — Vota no card. Body `{ cardId, isUpvote }`. Alterna entre like/neutral/dislike, atualiza `up_down` e devolve `user_vote`.
* **DELETE `/card/:id`** (autenticado) — Soft delete (`deactivated = true`). Somente o autor.

### Comentários

Base path: `/commentary`

* **GET `/commentary/:cardId`** — Lista comentários do card. Query: `parentId` (opcional), `page` (padrão 1), `limit` (padrão 20, máx 100). Comentários desativados retornam mensagem padrão. Inclui `user_vote` quando há token.
* **POST `/commentary/:cardId`** (autenticado) — Cria comentário ou reply. Body `{ content, parentId? }`.
* **PATCH `/commentary/:cardId/:commentId`** (autenticado) — Atualiza conteúdo (somente autor). Body `{ content }`.
* **PATCH `/commentary`** (autenticado) — Vota no comentário. Body `{ cardId, commentaryId, isUpvote }`. Atualiza `up_down` e `user_vote`.
* **DELETE `/commentary/:cardId/:commentId`** (autenticado) — Marca comentário como desativado (soft delete do autor).

---

## Modelo de dados

* `user(uid, role, created_at, updated_at)`
* `tag(id, name, description, image_url, created_at, updated_at)`
* `card(id, title, description, author, user_id, up_down, deactivated, created_at, updated_at)`
* `card_tags(card_id, tag_id)` pivot N:N
* `card_vote(card_id, user_id, vote, created_at, updated_at)`
* `comment(id, card_id, user_uid, author, content, up_down, parent_id, deactivate, created_at, updated_at)`
* `comment_vote(comment_id, user_id, vote, created_at, updated_at)`
* `SequelizeMeta`

Relacionamentos:

* Card N:N Tag por `card_tags`
* Card 1:N Comment
* Comment 1:N Comment via `parent_id`
* Card 1:N CardVote | Comment 1:N CommentVote

Obs.: existe uma migração legada que cria `comment_reaction`, mas o código usa `comment_vote` para armazenar likes/dislikes.

---

## Boas práticas e notas

* Envie `Authorization: Bearer <ID_TOKEN>` nas rotas protegidas; sem header os endpoints públicos funcionam, mas `user_vote` retorna `0`.
* CORS libera apenas `FRONTEND_URL` (padrão `http://localhost:3000`); a API sobe em `PORT` (padrão `3001`) e o Swagger só aparece fora de produção.
* Paginação: cards fixo em 20 itens via `page`; comentários usam `page` e `limit` (padrão 20, máx 100).
* Códigos de verificação/recuperação ficam 10 min no Redis com limite de 5 tentativas por e-mail; a contagem de tags é cacheada por 5 min.
* `EmailService` usa Gmail + senha de app; troque o `service` se usar outro provedor.
* Exclusão de card/comentário é soft delete (`deactivated`/`deactivate`); comentários desativados retornam mensagem placeholder.

---

## Licença


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


Copyright (c) 2025 Desedux

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
