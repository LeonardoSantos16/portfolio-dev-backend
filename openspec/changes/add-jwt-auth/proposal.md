# Change: Autenticação JWT para rotas de escrita

## Why
Todas as rotas de escrita (POST/PUT/DELETE) da API estão públicas: qualquer pessoa pode
criar, alterar ou apagar projetos, experiências e ícones, além de enviar arquivos de até
5 MB para o bucket R2. É preciso restringir a escrita ao único administrador do portfólio,
mantendo a leitura pública para o site.

## What Changes
- **ADDED** `POST /auth/login`: troca credenciais do admin (definidas em variáveis de
  ambiente) por um JWT HS256 de curta duração.
- **ADDED** `authMiddleware`: exige `Authorization: Bearer <token>` válido em todas as
  rotas POST/PUT/DELETE de `/repository`, `/experiences`, `/icon` e `/iconRepository`.
- **ADDED** Rate limit no login (5 tentativas / 15 min por IP).
- **ADDED** Variáveis de ambiente: `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_EMAIL`,
  `ADMIN_PASSWORD_HASH`.
- **ADDED** Script `npm run hash-password` para gerar o hash bcrypt da senha.
- **ADDED** Infraestrutura de testes (Vitest + Supertest).
- **MODIFIED** `src/server.ts` dividido em `src/app.ts` (montagem do app) e `src/server.ts`
  (sync + listen + export para a Vercel). Sem mudança de comportamento.
- **BREAKING** Clientes que hoje escrevem na API sem credenciais passam a receber 401.

## Impact
- Specs afetadas: `auth` (nova capability)
- Código afetado: `src/server.ts`, `src/app.ts` (novo), `src/env.ts`, `src/routes/*.ts`,
  `src/auth/*` (novo), `package.json`
- Deploy: as novas variáveis precisam estar configuradas na Vercel **antes** do deploy,
  senão `env.ts` falha na inicialização.
- Frontend/painel admin: precisa implementar a tela de login e enviar o header Bearer.
