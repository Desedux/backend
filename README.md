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

* Node 22.20.0
* NestJS + TypeScript
* PostgreSQL
* Sequelize ORM 6.37.x + sequelize-typescript
* Sequelize CLI 6.6.x
* Swagger/OpenAPI

---

## Pré-requisitos

* Node 22.20.0 e npm 10+
* PostgreSQL 14+ com um banco criado
* Credenciais de serviço do Firebase Admin para validação de tokens
* Credenciais de e-mail para envio de tokens de verificação e refatoração de senha

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

Crie um arquivo `.env` na raiz com as variáveis abaixo. As variáveis de e-mail são usadas pelo serviço de envio de tokens durante criação de conta e refatoração de senha.

```ini
APP_ENV=local

# Firebase
FIREBASE_API_KEY=your_firebase_api_key
# JSON completo da service account do Firebase Admin em uma única linha
FIREBASE_ADMIN_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\nABC...XYZ\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk@seu-projeto.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40seu-projeto.iam.gserviceaccount.com"}

# E-mail remetente para tokens de verificação e refatoração de senha
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_api_password

# PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=secretpassword
POSTGRES_DB=mydatabase
POSTGRES_PORT=5432
```

Observações rápidas:

* `FIREBASE_ADMIN_CREDENTIALS` deve conter o JSON da service account. Mantenha as quebras de linha do `private_key` com `\n`.
* O provedor de e-mail depende do que foi configurado no projeto. `EMAIL_USER` e `EMAIL_PASSWORD` precisam ter permissão de envio SMTP ou API usada no código.

---

## Banco de dados

O projeto lê a configuração via `.env`. Passos:

```bash
# 1) Crie o banco se necessário
# psql -h 127.0.0.1 -U postgres -c "CREATE DATABASE mydatabase;"

# 2) Executar migrações
npx sequelize-cli db:migrate

# 3) Executar seeds
npx sequelize-cli db:seed:all
```

---

## Executando

```bash
# Desenvolvimento com reload
npm run start:dev

# Produção
npm run build
npm run start:prod
```

Swagger UI: [http://localhost:3000/api](http://localhost:3000/api)
> A porta padrão é `3000`, mas pode ser alterada pela variável `PORT`.

---

## Scripts úteis

```bash
# Lint
npm run lint

# Testes
npm test

# Migrações e seeds
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo:all
```

---

## Rotas da API

Headers comuns:

```
Content-Type: application/json
Authorization: Bearer <ID_TOKEN>   # obrigatório nas rotas protegidas
```

### Health

#### GET `/`

Retorna status do servidor.

Resposta:

```json
{
  "status": "ok",
  "message": "Server running",
  "uptime": 123.45,
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### Auth e User

Fluxo baseado em Firebase. O cliente obtém o ID token no app e envia no header `Authorization`.

Rotas existentes:

* `POST /auth/login`
* `POST /auth/refresh`
* `POST /user/verification-token`
* `POST /user/refactor-token`
* `POST /user/register`
* `PATCH /user/change-password`
* `GET /user/profile`

### Tags

#### GET `/tags`

Lista tags.

Resposta exemplo:

```json
[
  { "id": 1, "name": "Segurança", "description": "..." },
  { "id": 2, "name": "Educação", "description": "..." }
]
```

### Cards

#### GET `/card/{page}`

Lista cards paginados, 20 por página, ordenados por `up_down DESC`.

Parâmetros:

* `page` path param

#### GET `/card/detail/{id}`

Retorna um card por id.

#### POST `/card`  (autenticado)

Cria card.

Body:

```json
{
  "title": "Sugestão de melhoria",
  "description": "Adicionar modo offline",
  "isAnonymous": false,
  "tags": [1, 2]
}
```

#### PATCH `/card/{id}`  (autenticado)

Voto agregado do card.

Body:

```json
{ "isUpvote": true }
```

#### DELETE `/card/{id}`  (autenticado)

Remove o card conforme regras de autorização.

### Comentários

Base path: `/commentary`

#### GET `/commentary/{cardId}`

Lista comentários do card. Suporta paginação e thread.

Query:

* `parentId` opcional. Omitido para raiz, definido para replies.
* `page` opcional, padrão 1
* `limit` opcional, padrão 20, máx 100

#### POST `/commentary/{cardId}`  (autenticado)

Cria comentário ou reply.

Body:

```json
{ "content": "Concordo com a ideia", "parentId": null }
```

#### PATCH `/commentary/{cardId}/{commentId}`  (autenticado)

Edita conteúdo.

Body:

```json
{ "content": "Atualizando o texto" }
```

#### DELETE `/commentary/{cardId}/{commentId}`  (autenticado)

Remove comentário. Requer ser autor.

#### PATCH `/commentary/{cardId}/{commentId}/reaction`  (autenticado)

Define reação do usuário ao comentário.

Body:

```json
{ "action": "like" }   // like | dislike | none
```

Resposta:

```json
{
  "commentId": 15,
  "up_down": 4,
  "myReaction": "like"
}
```

---

## Modelo de dados

* `user(uid, role, created_at, updated_at)`
* `tag(id, name, description, image_url, created_at, updated_at)`
* `card(id, title, description, author, user_id, up_down, created_at, updated_at)`
* `card_tags(card_id, tag_id)` pivot N:N
* `comment(id, card_id, user_uid, author, content, up_down, parent_id, created_at, updated_at)`
* `comment_reaction(comment_id, user_uid, action)`
* `SequelizeMeta`

Relacionamentos:

* Card N:N Tag por `card_tags`
* Comment N:1 Card
* Comment 1:N Comment via `parent_id`
* Reação por par (`comment_id`, `user_uid`)

---

## Boas práticas e notas

* Enviar `Authorization: Bearer <ID_TOKEN>` em rotas protegidas.
* Paginação padrão 20 itens, `limit` até 100.
* Registre modelos pivô no módulo `SequelizeModule.forFeature` para relações N:N.
* `EMAIL_USER` e `EMAIL_PASSWORD` devem pertencer a uma conta habilitada para envio no provedor configurado.

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
