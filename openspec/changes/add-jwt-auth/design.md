# Design: add-jwt-auth

## Context
Portfólio pessoal com um único autor. A API é pública para leitura e roda em ambiente
serverless (Vercel). Não existe hoje nenhum mecanismo de autenticação, tabela de usuários
ou suíte de testes.

## Goals / Non-Goals
- Goals
  - Somente o administrador consegue executar POST/PUT/DELETE.
  - GETs continuam públicos e sem mudança de contrato.
  - Implementação stateless, compatível com serverless.
  - Cobertura por testes automatizados (TDD).
- Non-Goals
  - Múltiplos usuários, papéis, cadastro, recuperação de senha.
  - Refresh tokens e revogação individual de tokens.
  - Restrição de CORS (registrado em Open Questions / trabalho futuro).
  - Rate limit distribuído.

## Decisions

| # | Decisão | Alternativas descartadas | Motivo |
|---|---------|--------------------------|--------|
| D1 | Admin único, credenciais em env (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`) | Tabela `users` | Sem rota de cadastro = menor superfície; sem migrations |
| D2 | Hash com `bcryptjs`, custo 12 | `argon2`, `bcrypt` nativo | JS puro, sem binário nativo na Vercel |
| D3 | `jsonwebtoken`, HS256, `algorithms: ['HS256']` fixo na verificação | `jose`, RS256 | Um único emissor/verificador; fixar algoritmo bloqueia `alg: none` e confusão de algoritmo |
| D4 | `JWT_SECRET` com no mínimo 32 caracteres, validado por Zod em `env.ts` | Sem validação | Falha rápida na inicialização com segredo fraco |
| D5 | Claims: `sub: 'admin'`, `iss: 'portfolio-api'`, `aud: 'portfolio-admin'`, `iat`, `exp`; `iss`/`aud` verificados | Payload com e-mail | Nada sensível no payload (JWT é só assinado, não cifrado) |
| D6 | Só access token, `JWT_EXPIRES_IN` (padrão `1h`); logout no cliente | Access + refresh com rotação | Uso esporádico; refresh exigiria estado. Revogação de emergência = trocar `JWT_SECRET` |
| D7 | Transporte via `Authorization: Bearer` | Cookie `httpOnly` | Sem CSRF; simples de testar; front e API em domínios distintos |
| D8 | 401 genérico (`Não autorizado.`) + `WWW-Authenticate: Bearer`; sem 403 | Mensagens distintas por motivo | Não dar pistas ao atacante; papel único |
| D9 | Login com mensagem única `Credenciais inválidas.`; `bcrypt.compare` executado mesmo com e-mail errado (contra hash dummy) | Retorno antecipado | Evitar enumeração por mensagem e por tempo |
| D10 | Comparação do e-mail case-insensitive após `trim` | Comparação exata | Usabilidade, sem impacto de segurança |
| D11 | `express-rate-limit` em memória, 5 req / 15 min por IP no `/auth/login`; `app.set('trust proxy', 1)` | Upstash Redis | Sem nova infra; bcrypt custo 12 já encarece força bruta |
| D12 | `authMiddleware` antes de `upload.single('image')` | Depois | Rejeitar não autenticados antes de bufferizar até 5 MB |
| D13 | Extrair `src/app.ts` de `src/server.ts` | Mockar `sequelize.sync` | Testabilidade sem efeitos colaterais; Vercel continua usando `server.ts` |
| D14 | Vitest + Supertest; `vi.mock` para services/db/R2 | Jest | TS nativo, mocks de módulo simples |

### Estrutura de módulos
```
src/app.ts                     # cria o app (trust proxy, cors, json, routes)
src/server.ts                  # import app; sync + listen fora de produção; export default app
src/auth/tokenService.ts       # signToken(), verifyToken()
src/auth/AuthService.ts        # login(email, password) -> { token, expiresIn }
src/auth/authMiddleware.ts     # requireAuth
src/auth/loginRateLimit.ts     # limiter do login
src/controllers/authController.ts
src/routes/auth.routes.ts      # POST /auth/login
src/schemas/authSchema.ts      # loginSchema (Zod)
scripts/hash-password.ts       # gera ADMIN_PASSWORD_HASH
```
Os módulos de `src/auth/` recebem configuração (segredo, expiração, credenciais) do `env`,
mas expõem funções que aceitam essa configuração por parâmetro (ou fábrica) para que os
testes unitários não dependam de `process.env`.

## Risks / Trade-offs
- **Rate limit por instância em serverless** → mitigação parcial; aceitável pelo custo do
  bcrypt. Revisitar com store distribuído se houver abuso.
- **Token roubado é válido até expirar (≤ 1h)** → expiração curta; troca de `JWT_SECRET`
  invalida todos.
- **Token armazenado no cliente (XSS no painel)** → responsabilidade do frontend: guardar
  em memória quando possível.
- **Deploy sem as novas env vars quebra a API inteira** (inclusive GETs), porque `env.ts`
  valida na importação → documentar no checklist de deploy.

## Migration Plan
1. Gerar hash com `npm run hash-password` e segredo com
   `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`.
2. Configurar `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (e opcionalmente
   `JWT_EXPIRES_IN`) na Vercel e no `.env` local.
3. Atualizar o painel admin para fazer login e enviar o header Bearer.
4. Deploy. Rollback = reverter o commit (nenhuma mudança de banco).

## Open Questions / Trabalho futuro
- Restringir CORS a uma lista de origens (`CORS_ORIGINS`).
- Rate limit distribuído (Upstash) se necessário.
