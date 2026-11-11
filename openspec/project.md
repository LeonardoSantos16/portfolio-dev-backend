# Project Context

## Purpose
API REST que alimenta o portfólio pessoal do autor: projetos (`repository`), experiências
(`experiences`), ícones de tecnologias (`icon`) e a relação projeto↔ícone (`iconRepository`).
O site público só lê; a escrita é feita por um único administrador.

## Tech Stack
- Node.js + TypeScript (CommonJS, ES2020, `strict`)
- Express 4, Sequelize 6 (PostgreSQL), Zod 4
- Multer (memória) + AWS SDK S3 → Cloudflare R2
- Deploy: Vercel (`@vercel/node`, `src/server.ts` exporta o `app`)
- Testes: Vitest + Supertest (introduzidos pela change `add-jwt-auth`)

## Project Conventions

### Code Style
Aspas simples, sem ponto e vírgula em `src/`; mensagens ao cliente em português;
erros no formato `{ message: string }`.

### Architecture Patterns
Routes → Controllers (classes com métodos arrow, mapeiam erros para status HTTP) →
Services (regras de negócio) → Models Sequelize (`models/`).

### Testing Strategy
TDD (red → green → refactor). Unitários para serviços puros; integração via Supertest
contra `src/app.ts`, mockando banco, R2 e services com `vi.mock`.

## Important Constraints
- Ambiente serverless (Vercel): sem estado compartilhado entre instâncias.
- `src/env.ts` valida variáveis de ambiente na importação.

## External Dependencies
PostgreSQL (`DATABASE_URL`), Cloudflare R2.
