# FinBank API

API bancária REST desenvolvida com Node.js, Express.js, Sequelize e MySQL.

O projeto simula operações básicas de um sistema bancário, incluindo cadastro de usuários, contas bancárias, depósitos, saques, transferências, autenticação JWT e gerenciamento de transações.

## Tecnologias

- Node.js
- Express.js
- MySQL
- Sequelize
- Sequelize CLI
- JWT
- bcryptjs
- Swagger
- Jest
- Supertest
- Nodemon
- CORS
- dotenv

## Funcionalidades

### Autenticação

- Cadastro de usuário
- Login
- Hash de senha com bcrypt
- Autenticação utilizando JWT
- Proteção de rotas

### Usuários

- Listagem de usuários
- Busca por ID
- Criação
- Atualização
- Exclusão
- Validação de e-mail
- Validação de CPF
- Validação de senha
- Proteção contra duplicidade

### Contas bancárias

- Criação de contas
- Listagem
- Busca por ID
- Atualização
- Exclusão
- Conta corrente
- Conta poupança
- Controle de saldo

### Operações bancárias

- Depósito
- Saque
- Validação de valores
- Validação de saldo
- Registro das operações

### Transferências

- Transferência entre contas
- Validação das contas
- Validação de saldo
- Impedimento de transferência para a mesma conta
- Controle transacional com Sequelize

### Transações

- Listagem
- Busca por ID
- Atualização
- Exclusão
- Registro de depósitos
- Registro de saques
- Registro de transferências

## Estrutura do projeto

```text
finbank-api/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── swagger.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── accountController.js
│   │   ├── bankingController.js
│   │   └── transactionController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Account.js
│   │   ├── Transaction.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── accountRoutes.js
│   │   ├── bankingRoutes.js
│   │   └── transactionRoutes.js
│   │
│   ├── services/
│   │   └── authService.js
│   │
│   ├── app.js
│   └── server.js
│
├── migrations/
│   ├── create-users.js
│   ├── create-accounts.js
│   └── create-transactions.js
│
├── tests/
│   └── api.test.js
│
├── .env
├── .env.example
├── .env.test
├── .gitignore
├── .sequelizerc
├── package.json
└── README.md
```

## Banco de dados

O projeto utiliza MySQL.

Banco de desenvolvimento:

```text
finbank
```

Banco utilizado pelos testes:

```text
finbank_test
```

### Tabelas

```text
users
├── id
├── name
├── email
├── cpf
├── password
├── createdAt
└── updatedAt

accounts
├── id
├── userId
├── number
├── type
├── balance
├── createdAt
└── updatedAt

transactions
├── id
├── accountId
├── type
├── amount
├── description
├── status
└── createdAt
```

### Relacionamentos

```text
User
 │
 └── 1:N
      │
      ▼
   Account
      │
      └── 1:N
           │
           ▼
       Transaction
```

## Instalação

Clone o projeto:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd finbank-api
```

Instale as dependências:

```bash
npm install
```

## Configuração

Crie o arquivo `.env`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=finbank
DB_USER=root
DB_PASSWORD=

JWT_SECRET=finbank_secret_2026_chave_super_segura
JWT_EXPIRES_IN=1d
```

Preencha `DB_PASSWORD` com a senha do seu MySQL.

## Migrations

Para executar as migrations no banco de desenvolvimento:

```bash
npx sequelize-cli db:migrate --env development
```

Para executar as migrations no banco de testes:

```bash
npx sequelize-cli db:migrate --env test
```

## Executar a aplicação

Modo desenvolvimento:

```bash
npm run dev
```

Modo produção:

```bash
npm start
```

A API ficará disponível em:

```text
http://localhost:3000
```

## Swagger

A documentação interativa da API está disponível em:

```text
http://localhost:3000/api-docs
```

O Swagger permite visualizar e testar os endpoints da aplicação.

Para acessar endpoints protegidos, utilize o botão `Authorize` e informe:

```text
Bearer SEU_TOKEN_JWT
```

## Endpoints

### Autenticação

```text
POST /auth/register
POST /auth/login
```

### Usuários

```text
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
```

### Contas

```text
GET    /accounts
GET    /accounts/:id
POST   /accounts
PUT    /accounts/:id
DELETE /accounts/:id
```

### Operações bancárias

```text
POST /accounts/:id/deposit
POST /accounts/:id/withdraw
```

### Transações

```text
GET    /transactions
GET    /transactions/:id
POST   /transactions/transfer
PUT    /transactions/:id
DELETE /transactions/:id
```

## Autenticação

As rotas protegidas utilizam JWT.

Após realizar login:

```text
POST /auth/login
```

A API retorna um token.

Esse token deve ser enviado no cabeçalho:

```text
Authorization: Bearer SEU_TOKEN
```

## Exemplo de cadastro

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "cpf": "12345678901",
  "password": "123456"
}
```

## Exemplo de login

```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

## Exemplo de depósito

```json
{
  "amount": 500,
  "description": "Depósito inicial"
}
```

## Exemplo de saque

```json
{
  "amount": 200,
  "description": "Saque"
}
```

## Exemplo de transferência

```json
{
  "fromAccountId": 1,
  "toAccountId": 2,
  "amount": 250,
  "description": "Transferência"
}
```

## Testes

Executar os testes:

```bash
npm test
```

Executar os testes em modo observação:

```bash
npm run test:watch
```

Executar os testes com cobertura:

```bash
npm run test:coverage
```

Os testes utilizam:

- Jest
- Supertest
- Banco `finbank_test`

## Scripts

```text
npm run dev
npm start
npm test
npm run test:watch
npm run test:coverage
```

## Status HTTP utilizados

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
404 Not Found
500 Internal Server Error
```

## Segurança

O projeto utiliza:

- bcryptjs para armazenamento seguro das senhas
- JWT para autenticação
- Middleware para proteção das rotas
- Variáveis de ambiente para informações sensíveis
- `.gitignore` para impedir o envio do `.env`

## Objetivo

Projeto desenvolvido com objetivo educacional para praticar desenvolvimento de APIs REST, autenticação, banco de dados relacional, ORM, testes automatizados e documentação de APIs.

## Autor

Gabriel Santos
