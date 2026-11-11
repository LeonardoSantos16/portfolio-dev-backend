# Auth Specification (delta)

## ADDED Requirements

### Requirement: Admin Login
O sistema SHALL expor `POST /auth/login`, que recebe `{ email, password }` e, quando as
credenciais correspondem a `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH`, responde 200 com
`{ token, expiresIn }`.

#### Scenario: Credenciais válidas
- **WHEN** o cliente envia `POST /auth/login` com o e-mail e a senha corretos do admin
- **THEN** a resposta é 200
- **AND** o corpo contém `token` (JWT) e `expiresIn` (ex.: `"1h"`)

#### Scenario: E-mail com caixa e espaços diferentes
- **WHEN** o cliente envia o e-mail do admin com letras maiúsculas ou espaços nas pontas e a senha correta
- **THEN** a resposta é 200

#### Scenario: Senha incorreta
- **WHEN** o cliente envia o e-mail correto e uma senha incorreta
- **THEN** a resposta é 401 com `{ "message": "Credenciais inválidas." }`

#### Scenario: E-mail desconhecido
- **WHEN** o cliente envia um e-mail diferente de `ADMIN_EMAIL`
- **THEN** a resposta é 401 com `{ "message": "Credenciais inválidas." }`
- **AND** a verificação bcrypt é executada mesmo assim (sem retorno antecipado)

#### Scenario: Corpo inválido
- **WHEN** o corpo não contém `email` válido ou `password` não vazio
- **THEN** a resposta é 400 com `{ "message": string }` em português
- **AND** nenhuma verificação de senha é executada

### Requirement: Login Rate Limiting
O sistema SHALL limitar `POST /auth/login` a 5 tentativas malsucedidas por janela de 15
minutos por endereço IP do cliente. Logins bem-sucedidos MUST NOT contar para o limite.
O IP SHALL ser obtido do `X-Forwarded-For` somente quando a aplicação roda na Vercel
(`VERCEL` definido); nos demais ambientes, o IP da conexão é usado.

#### Scenario: Limite excedido
- **WHEN** o mesmo IP faz uma requisição de login após 5 tentativas malsucedidas dentro de 15 minutos
- **THEN** a resposta é 429 com `{ "message": string }`
- **AND** as credenciais não são avaliadas, mesmo que estejam corretas

#### Scenario: Logins bem-sucedidos não bloqueiam
- **WHEN** o admin faz 6 logins válidos seguidos a partir do mesmo IP
- **THEN** todos respondem 200

#### Scenario: X-Forwarded-For forjado fora da Vercel
- **WHEN** a aplicação roda fora da Vercel e um cliente varia o `X-Forwarded-For` a cada tentativa
- **THEN** as tentativas são contadas pelo IP real da conexão e a 6ª responde 429

#### Scenario: Rate limit isolado ao login
- **WHEN** um IP excede o limite do login
- **THEN** as rotas GET públicas continuam respondendo normalmente para esse IP

### Requirement: Token Issuance
O sistema SHALL emitir JWTs assinados com HS256 usando `JWT_SECRET`, contendo as claims
`sub: "admin"`, `iss: "portfolio-api"`, `aud: "portfolio-admin"`, `iat` e `exp`, com
validade definida por `JWT_EXPIRES_IN` (padrão `1h`). O token MUST NOT conter e-mail,
senha ou hash.

#### Scenario: Claims do token emitido
- **WHEN** um token é emitido após login válido
- **THEN** o header tem `alg: "HS256"`
- **AND** o payload tem `sub`, `iss`, `aud`, `iat`, `exp` com os valores definidos
- **AND** `exp - iat` corresponde a `JWT_EXPIRES_IN`

### Requirement: Token Verification
O sistema SHALL aceitar um token somente se a assinatura for válida com `JWT_SECRET`, o
algoritmo for HS256, `sub`, `iss` e `aud` corresponderem aos valores esperados e o token não
estiver expirado.

#### Scenario: Token válido
- **WHEN** um token emitido pelo sistema e dentro da validade é verificado
- **THEN** a verificação é bem-sucedida e retorna `sub: "admin"`

#### Scenario: Token expirado
- **WHEN** um token com `exp` no passado é verificado
- **THEN** a verificação falha

#### Scenario: Assinatura com outro segredo
- **WHEN** um token assinado com um segredo diferente é verificado
- **THEN** a verificação falha

#### Scenario: Algoritmo `none` ou diferente de HS256
- **WHEN** um token com `alg: "none"` ou outro algoritmo é verificado
- **THEN** a verificação falha

#### Scenario: Subject diferente de admin
- **WHEN** um token assinado corretamente tem `sub` diferente de `"admin"` ou não tem `sub`
- **THEN** a verificação falha

#### Scenario: Issuer ou audience incorretos
- **WHEN** um token assinado com o segredo correto mas com `iss` ou `aud` diferentes é verificado
- **THEN** a verificação falha

#### Scenario: Token malformado
- **WHEN** uma string que não é um JWT é verificada
- **THEN** a verificação falha sem lançar erro não tratado

### Requirement: Protected Write Routes
O sistema SHALL exigir `Authorization: Bearer <token>` válido em todas as rotas de escrita:
`POST /repository`, `PUT /repository/:id`, `DELETE /repository/:id`,
`POST /experiences`, `PUT /experiences/:id`, `DELETE /experiences/:id`,
`POST /icon`, `PUT /icon/:id`, `DELETE /icon/:id`,
`POST /iconRepository`, `DELETE /iconRepository`.
Qualquer falha de autenticação SHALL responder 401 com `{ "message": "Não autorizado." }`
e header `WWW-Authenticate: Bearer`, sem distinguir o motivo da falha.

#### Scenario: Sem header Authorization
- **WHEN** o cliente chama uma rota de escrita sem header `Authorization`
- **THEN** a resposta é 401 com `{ "message": "Não autorizado." }` e `WWW-Authenticate: Bearer`
- **AND** o controller/service da rota não é executado

#### Scenario: Esquema diferente de Bearer
- **WHEN** o header é `Authorization: Basic ...` ou `Authorization: <token>` sem esquema
- **THEN** a resposta é 401

#### Scenario: Token inválido ou expirado
- **WHEN** o cliente envia `Authorization: Bearer <token>` que falha na verificação
- **THEN** a resposta é 401 com a mesma mensagem genérica

#### Scenario: Token válido
- **WHEN** o cliente envia `Authorization: Bearer <token válido>`
- **THEN** a requisição segue para o controller da rota normalmente

#### Scenario: Upload rejeitado antes do processamento
- **WHEN** o cliente envia `POST /repository` multipart com imagem e sem token válido
- **THEN** a resposta é 401
- **AND** o middleware de upload (multer) não processa o arquivo

### Requirement: Public Read Routes
O sistema SHALL manter todas as rotas GET acessíveis sem autenticação.

#### Scenario: GET sem token
- **WHEN** o cliente chama `GET /repository`, `GET /repository/highlighted`, `GET /repository/:id`, `GET /experiences`, `GET /experiences/:id`, `GET /icon`, `GET /icon/:id` ou `GET /iconRepository/:id` sem header `Authorization`
- **THEN** a requisição segue para o controller normalmente (sem 401)

### Requirement: Auth Configuration
O sistema SHALL validar na inicialização (`src/env.ts`) que `JWT_SECRET` tem no mínimo
32 caracteres, `ADMIN_EMAIL` é um e-mail válido e `ADMIN_PASSWORD_HASH` é um hash bcrypt;
`JWT_EXPIRES_IN` é opcional com padrão `1h` e, quando definido, MUST ser um inteiro positivo
seguido de unidade `s`, `m`, `h` ou `d`.

#### Scenario: Expiração sem unidade
- **WHEN** a aplicação inicia com `JWT_EXPIRES_IN=3600` (ou qualquer valor fora do formato)
- **THEN** a validação de ambiente falha com erro

#### Scenario: Segredo curto
- **WHEN** a aplicação inicia com `JWT_SECRET` de menos de 32 caracteres
- **THEN** a validação de ambiente falha com erro

#### Scenario: Hash ausente ou inválido
- **WHEN** `ADMIN_PASSWORD_HASH` está ausente ou não tem formato bcrypt (`$2a$`/`$2b$`/`$2y$`)
- **THEN** a validação de ambiente falha com erro
