# Tasks: add-jwt-auth

Cada item de implementação segue red → green → refactor (um teste por vez).

## 1. Infraestrutura
- [x] 1.1 Instalar `vitest`, `supertest`, `@types/supertest`; script `npm test`
- [x] 1.2 Instalar `jsonwebtoken`, `@types/jsonwebtoken`, `bcryptjs`, `express-rate-limit`
- [x] 1.3 Extrair `src/app.ts` de `src/server.ts` (refactor sem mudança de comportamento)

## 2. Token service (unitário)
- [x] 2.1 Emite token HS256 com `sub`, `iss`, `aud`, `iat`, `exp`
- [x] 2.2 Verifica token válido
- [x] 2.3 Rejeita expirado
- [x] 2.4 Rejeita segredo diferente
- [x] 2.5 Rejeita `alg: none` / algoritmo diferente
- [x] 2.6 Rejeita `iss`/`aud` incorretos
- [x] 2.7 Rejeita token malformado

## 3. AuthService.login (coberto via HTTP em `test/http/login.test.ts`; 3.4 "bcrypt executado" verificado em revisão, não por teste)
- [x] 3.1 Credenciais válidas → `{ token, expiresIn }`
- [x] 3.2 E-mail case-insensitive / trim
- [x] 3.3 Senha errada → erro de credenciais inválidas
- [x] 3.4 E-mail desconhecido → mesmo erro, bcrypt executado

## 4. Middleware de autenticação (integração)
- [x] 4.1 Sem header → 401 + `WWW-Authenticate: Bearer`
- [x] 4.2 Esquema não-Bearer → 401
- [x] 4.3 Token inválido/expirado → 401
- [x] 4.4 Token válido → passa ao controller
- [x] 4.5 Aplicar em todas as rotas de escrita (teste parametrizado)
- [x] 4.6 Auth antes do multer em `POST/PUT /repository`
- [x] 4.7 GETs continuam públicos (teste parametrizado)

## 5. Endpoint de login (integração)
- [x] 5.1 200 com credenciais válidas
- [x] 5.2 400 com corpo inválido
- [x] 5.3 401 com credenciais inválidas
- [x] 5.4 429 após 5 tentativas
- [x] 5.5 `trust proxy` configurado

## 6. Configuração
- [x] 6.1 Validar novas env vars em `src/env.ts`
- [x] 6.2 Script `npm run hash-password`
- [x] 6.3 Atualizar README e CLAUDE.md (env vars, `npm test`, fluxo de login)
