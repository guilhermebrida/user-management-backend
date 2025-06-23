<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" />
  </a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank">
    <img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" />
  </a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank">
    <img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/>
  </a>
  <a href="https://opencollective.com/nest#backer" target="_blank">
    <img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" />
  </a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank">
    <img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" />
  </a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank">
    <img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/>
  </a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank">
    <img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us">
  </a>
  <a href="https://twitter.com/nestframework" target="_blank">
    <img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter">
  </a>
</p>

---

## 🧠 Sobre o Projeto

Este é o **backend da aplicação de gerenciamento de usuários**, desenvolvido com NestJS e PostgreSQL.

- Autenticação com JWT
- Registro e login
- Sistema de usuários com roles (`user` e `admin`)
- Admins podem promover outros usuários a `admin`

---

## 🧪 Instalação

```bash
npm install
```

## ▶️ Executando
Ambiente de desenvolvimento
```bash
npm run start:dev
```
Produção
```bash
npm run start:prod
```
## ⚙️ Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto com o seguinte conteúdo para rodar localmente:

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/banco
```

## ⚠️ Exemplo com NeonDB:

```env
DATABASE_URL=postgresql://users_owner:npg_ZdwiJ9N4Voak@ep-wispy-band-a83avmvw-pooler.eastus2.azure.neon.tech/users?sslmode=require
```

## 🐳 Docker
As variáveis de ambiente já estão definidas no docker-compose.yml
### 📦 Criar imagem local

```bash
docker build -t guilhermebrida/user-management-backend .
```

### ☁️ Subir com Docker Compose

```bash
docker compose up
```

### 🐙 Imagem de Produção
A imagem está publicada no Docker Hub e pode ser executada com:

```bash
docker run -d \
  --name user-backend \
  --restart always \
  --env-file .env \
  -p 3000:3000 \
  guilhermebrida/user-management-backend:latest
```

## 🔐 Credenciais de Acesso
### 👤 Usuário administrador padrão

Email: admin@email.com

Senha: admin




## 📚 Swagger
Documentação de produção da API disponível em:

```bash
https://usermanagement.duckdns.org/api
```

Documentação local da API disponível em:

```bash
http://localhost:3000/api
```

## 🔗 Frontend
O frontend está disponível em:

https://github.com/guilhermebrida/user-management-frontend

## 📦 Deploy 
O deploy do backend foi realizado em uma maquina da Oracle (OCI) free tier. configuração nginx, liberação de porta devem ser realizados também. criação de dominio utilizei o duckDNS https://www.duckdns.org/, necessário para expor o backend e não ter erro de CORS ao fazer o deploy do frontend na Vercel.