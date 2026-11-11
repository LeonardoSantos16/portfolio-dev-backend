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
- `npm test` — **ainda não configurado** (não há framework de testes no projeto)

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
`CLOUDFLARE_PUBLIC_URL`, `CLOUDFLARE_BUCKET_NAME`, `PORT` (opcional), `NODE_ENV`.

## Convenções

- Mensagens de resposta ao cliente em português; logs com `console.error`
- Imports relativos (sem path aliases); módulo CommonJS, target ES2020, `strict: true`
- Estilo: aspas simples e sem ponto e vírgula na maioria dos arquivos de `src/`
  (alguns arquivos usam aspas duplas — siga o estilo do arquivo editado)
- Respostas de erro no formato `{ message: string }`

## Estado atual de segurança

- **Não há autenticação nem autorização**: todas as rotas de escrita
  (POST/PUT/DELETE) estão públicas.
- `cors()` sem restrição de origem.

## Pontos de atenção para testes

- Importar `src/server.ts`, `src/env.ts` ou qualquer model dispara efeitos colaterais
  (conexão com o banco, validação de env, cliente S3). Testes precisam definir env vars
  ou mockar esses módulos antes do import.

## Workflow em andamento

Implementação de autenticação JWT: requisitos via skill `grill-me` → spec de segurança no
formato OpenSpec (SDD) → implementação com a skill `tdd` (red → green → refactor).
