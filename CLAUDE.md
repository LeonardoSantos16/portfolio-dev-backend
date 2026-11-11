# CLAUDE.md

Contexto do projeto para o Claude Code.

## Visão geral

API REST (Node.js + TypeScript + Express) que alimenta o portfólio pessoal do autor. Gerencia
projetos (`repository`), experiências (`experiences`), ícones de tecnologias (`icon`) e a
relação projeto↔ícone (`iconRepository`). Imagens são enviadas ao Cloudflare R2 (API S3).
Deploy na Vercel (`vercel.json` aponta tudo para `src/server.ts`, que exporta o `app`).

## Comandos

- `npm run dev` — sobe o servidor com `ts-node src/server.ts` (porta `PORT` ou 3000)
- `npm run build` — `tsc`
- `npm test` — Vitest (`test/**/*.test.ts`); `npm run test:watch` para modo watch
- `npm run hash-password` — gera o `ADMIN_PASSWORD_HASH` (bcrypt, custo 12)

## Arquitetura

Camadas (Controller → Service → Model), sem injeção de dependência:

- `src/routes/` — um `Router` por recurso, montados em `src/routes/index.ts`
  (`/icon`, `/repository`, `/iconRepository`, `/experiences`)
- `src/controllers/` — classes com métodos arrow (`createX = async (req, res) => {}`);
  tratam HTTP, try/catch e mapeiam erros para status (ex.: `error.message === 'Repository not found'` → 404)
- `src/services/` — regras de negócio; instanciados diretamente dentro dos controllers
  (`private repositoryService = new RepositoryService()`)
- `models/` (raiz) — models Sequelize (`Model.init`), `underscored: true`
- `sequelize/db.ts` — instância única do Sequelize via `DATABASE_URL` (Postgres com SSL);
  lança erro na importação se a variável não existir
- `src/schemas/` — schemas Zod (Zod v4) e tipos inferidos (`z.infer`)
- `src/interfaces/` — interfaces TS dos atributos dos models
- `src/middleware/uploadMiddleware.ts` — multer em memória, 5 MB, JPEG/PNG/GIF
- `src/utils/R2Storage.ts` + `src/lib/cloudflare.ts` — upload/remoção no R2
- `src/env.ts` — validação de variáveis de ambiente com Zod (`env.parse(process.env)` na importação)

## Banco de dados

- PostgreSQL em todos os ambientes (`sequelize/db.ts`). `config/config.json` existe para o
  `sequelize-cli`, mas não há pasta de migrations versionada.
- Fora de produção, `server.ts` roda `sequelize.sync({ alter: true })` antes do `listen`.
  Em produção (Vercel) o app é apenas exportado.

## Variáveis de ambiente (`.env`, não versionado)

`DATABASE_URL`, `CLOUDFLARE_ENDPOINT`, `CLOUDFLARE_ACCESS_KEY`, `CLOUDFLARE_SECRET_KEY`,
`CLOUDFLARE_PUBLIC_URL`, `CLOUDFLARE_BUCKET_NAME`, `JWT_SECRET` (≥ 32 chars),
`JWT_EXPIRES_IN` (opcional, padrão `1h`), `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (bcrypt),
`PORT` (opcional), `NODE_ENV`.

## Convenções

- Mensagens de resposta ao cliente em português; logs com `console.error`
- Imports relativos (sem path aliases); módulo CommonJS, target ES2020, `strict: true`
- Estilo: aspas simples e sem ponto e vírgula na maioria dos arquivos de `src/`
  (alguns arquivos usam aspas duplas — siga o estilo do arquivo editado)
- Respostas de erro no formato `{ message: string }`

## Autenticação

- Admin único; credenciais em env (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`). Sem tabela de usuários.
- `POST /auth/login` → JWT HS256 (`sub: admin`, `iss: portfolio-api`, `aud: portfolio-admin`),
  validade `JWT_EXPIRES_IN` (sempre com unidade: `30m`, `1h`, `1d`). Sem refresh token.
  Rate limit: 5 tentativas **malsucedidas** / 15 min por IP.
- `requireAuth` (`src/auth/authMiddleware.ts`) protege **todas** as rotas POST/PUT/DELETE.
  Ao criar uma rota de escrita nova, aplique `requireAuth` e inclua-a na lista `writeRoutes`
  de `test/http/protectedRoutes.test.ts`. Em rotas com upload, `requireAuth` vem antes do multer.
- GETs são públicos. `trust proxy` só é ligado quando `VERCEL` está definido (a Vercel define
  automaticamente); fora dela, o `X-Forwarded-For` é do cliente e não é confiável.
- Spec (OpenSpec): `openspec/changes/add-jwt-auth/`.
- `cors()` ainda sem restrição de origem (trabalho futuro).

## Testes

- `src/app.ts` monta o app sem efeitos colaterais; `src/server.ts` faz sync + listen. Testes importam `app.ts`.
- `test/setup-env.ts` define as env vars de teste (credenciais de admin conhecidas e `VERCEL=1`).
- Mocks só nas fronteiras: models Sequelize e `R2Storage`, registrados uma única vez em
  `test/setup-boundaries.ts` (dublês em `test/helpers/boundaries.ts`). Model novo → adicione lá.
  Não mockar services nem controllers.
- Requisições de login em teste devem usar `X-Forwarded-For` distintos para não esbarrar no rate limit.
- Fluxo de trabalho: spec OpenSpec → TDD (skill `tdd`), uma fatia vertical por vez.
