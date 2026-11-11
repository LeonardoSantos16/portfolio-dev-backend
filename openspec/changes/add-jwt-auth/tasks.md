# Tasks: add-jwt-auth

Cada item de implementação segue red → green → refactor (um teste por vez).

## 1. Infraestrutura
- [ ] 1.1 Instalar `vitest`, `supertest`, `@types/supertest`; script `npm test`
- [ ] 1.2 Instalar `jsonwebtoken`, `@types/jsonwebtoken`, `bcryptjs`, `express-rate-limit`
- [ ] 1.3 Extrair `src/app.ts` de `src/server.ts` (refactor sem mudança de comportamento)

## 2. Token service (unitário)
- [ ] 2.1 Emite token HS256 com `sub`, `iss`, `aud`, `iat`, `exp`
- [ ] 2.2 Verifica token válido
- [ ] 2.3 Rejeita expirado
- [ ] 2.4 Rejeita segredo diferente
- [ ] 2.5 Rejeita `alg: none` / algoritmo diferente
- [ ] 2.6 Rejeita `iss`/`aud` incorretos
- [ ] 2.7 Rejeita token malformado

## 3. AuthService.login (unitário)
- [ ] 3.1 Credenciais válidas → `{ token, expiresIn }`
- [ ] 3.2 E-mail case-insensitive / trim
- [ ] 3.3 Senha errada → erro de credenciais inválidas
- [ ] 3.4 E-mail desconhecido → mesmo erro, bcrypt executado

## 4. Middleware de autenticação (integração)
- [ ] 4.1 Sem header → 401 + `WWW-Authenticate: Bearer`
- [ ] 4.2 Esquema não-Bearer → 401
- [ ] 4.3 Token inválido/expirado → 401
- [ ] 4.4 Token válido → passa ao controller
- [ ] 4.5 Aplicar em todas as rotas de escrita (teste parametrizado)
- [ ] 4.6 Auth antes do multer em `POST/PUT /repository`
- [ ] 4.7 GETs continuam públicos (teste parametrizado)

## 5. Endpoint de login (integração)
- [ ] 5.1 200 com credenciais válidas
- [ ] 5.2 400 com corpo inválido
- [ ] 5.3 401 com credenciais inválidas
- [ ] 5.4 429 após 5 tentativas
- [ ] 5.5 `trust proxy` configurado

## 6. Configuração
- [ ] 6.1 Validar novas env vars em `src/env.ts`
- [ ] 6.2 Script `npm run hash-password`
- [ ] 6.3 Atualizar README e CLAUDE.md (env vars, `npm test`, fluxo de login)
