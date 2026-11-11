# Portfolio API (Backend)

API REST desenvolvida para gerenciar dinamicamente as informações do meu portfólio pessoal. O sistema centraliza o controle de projetos, experiências profissionais e o armazenamento de assets em nuvem.

## Tech Stack

* **Runtime:** Node.js + TypeScript
* **Framework:** Express
* **ORM:** Sequelize (PostgreSQL / SQLite)
* **Validação:** Zod
* **Upload:** Multer + AWS SDK (Cloudflare R2)
* **Autenticação:** JWT (jsonwebtoken, HS256) + bcryptjs + express-rate-limit
* **Testes:** Vitest + Supertest
* **Serviços:** Cors, Dotenv

## Arquitetura e Decisões de Projeto

* **Arquitetura Controller-Service:** Separação clara entre a camada de transporte (HTTP) e a lógica de negócio, facilitando testes e manutenção.
* **Storage em Nuvem:** Integração com **Cloudflare R2** via protocolo S3 para o upload de imagens, evitando perda de arquivos em deploys efêmeros.
* **Persistência Híbrida:** Configuração preparada para rodar com **SQLite** em desenvolvimento e **PostgreSQL** em produção.
* **Integridade de Dados:** Validação rigorosa de Schemas com **Zod** e controle de versão do banco de dados via **Migrations**.

## Principais Endpoints

* `GET /repositories`: Listagem de projetos com suporte a paginação e filtros.
* `GET /experiences`: Consulta de trajetória profissional filtrada por tipo.
* `POST /upload`: Endpoint especializado para gestão de imagens via Cloudflare.
* `GET /icons`: Gerenciamento de ícones de tecnologias e habilidades.

## Autenticação

As rotas de leitura (GET) são públicas. Todas as rotas de escrita (POST/PUT/DELETE) exigem
`Authorization: Bearer <token>`, obtido em:

* `POST /auth/login` com `{ "email", "password" }` → `{ "token", "expiresIn" }`
  (limitado a 5 tentativas a cada 15 min por IP)

Há um único administrador, definido por variáveis de ambiente. Spec completa em
`openspec/changes/add-jwt-auth/`.

## Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/LeonardoSantos16/portfolio-dev-backend.git](https://github.com/LeonardoSantos16/portfolio-dev-backend.git)
   Instale as dependências:
2. Instalar dependências
   ```bash
   npm install
3. Configure o .env:
  Crie um arquivo .env na raiz com as credenciais do Banco de Dados, as chaves de acesso ao Cloudflare (CLOUDFLARE_ACCESS_KEY, CLOUDFLARE_SECRET_KEY, etc) e as variáveis de autenticação:
   * `JWT_SECRET`: mínimo de 32 caracteres. Gere com `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`
   * `JWT_EXPIRES_IN`: opcional, padrão `1h`
   * `ADMIN_EMAIL`
   * `ADMIN_PASSWORD_HASH`: saída de `npm run hash-password` (a senha é digitada sem eco)

   Todas são validadas na inicialização: sem elas a API não sobe. Configure-as na Vercel **antes** do deploy.
4. Rode as migrations
   ```bash
   npx sequelize-cli db:migrate
5. Inicie em modo de desenvolvimento:  npm run dev
6. Rode os testes: npm test

Desenvolvido por Leonardo Mendes
