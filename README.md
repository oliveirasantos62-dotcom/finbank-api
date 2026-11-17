# FinBank API

API bancária REST desenvolvida com **Node.js, Express.js, Sequelize e MySQL**.

O projeto simula operações básicas de um sistema bancário, incluindo cadastro de usuários, gerenciamento de contas bancárias, depósitos, saques, transferências, autenticação JWT e histórico de transações.

A aplicação foi desenvolvida com arquitetura MVC, banco de dados relacional, migrations, documentação Swagger e testes automatizados.

## Tecnologias utilizadas

- Node.js
- Express.js
- MySQL
- Sequelize
- Sequelize CLI
- JSON Web Token (JWT)
- bcryptjs
- Swagger
- Jest
- Supertest
- Nodemon
- CORS
- dotenv

## Funcionalidades

### Autenticação

- Cadastro de usuários.
- Login.
- Criptografia de senhas utilizando bcrypt.
- Autenticação por JWT.
- Proteção de rotas.
- Autorização por proprietário.
- Controle de acesso aos dados de cada usuário.

### Usuários

- Criação de usuários.
- Listagem de usuários.
- Busca por ID.
- Atualização de dados.
- Exclusão com validação de dependências.
- Validação de e-mail.
- Validação de CPF.
- Validação de senha.
- Proteção contra registros duplicados.

### Contas bancárias

- Criação de contas.
- Listagem de contas.
- Busca por ID.
- Atualização de dados.
- Exclusão com validações de segurança.
- Suporte a conta corrente e poupança.
- Controle de saldo.
- Associação de contas aos respectivos proprietários.

### Operações bancárias

- Depósitos.
- Saques.
- Validação de valores.
- Validação de saldo disponível.
- Registro das operações no histórico.
- Atualização consistente do saldo.

### Transferências

- Transferências entre contas.
- Validação das contas de origem e destino.
- Validação de saldo disponível.
- Impedimento de transferência para a mesma conta.
- Atualização dos saldos envolvidos.
- Registro da operação financeira.
- Transações SQL para garantir atomicidade.
- Bloqueio de linhas para reduzir problemas de concorrência.

### Transações

- Listagem de transações.
- Busca por ID.
- Consulta paginada.
- Registro de depósitos, saques e transferências.
- Atualização permitida somente na descrição.
- Proteção dos dados financeiros contra alterações indevidas.
- Exclusão bloqueada para preservar o histórico.

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
│   ├── utils/
│   │   └── pagination.js
│   │
│   ├── app.js
│   └── server.js
│
├── migrations/
│   ├── create-users.js
│   ├── create-accounts.js
│   ├── create-transactions.js
│   └── 20261117000100-preserve-financial-history.js
│
├── tests/
│   └── api.test.js
│
├── .env.example
├── .gitignore
├── .sequelizerc
├── package.json
└── README.md
```

## Banco de dados

O projeto utiliza MySQL como sistema de gerenciamento de banco de dados e Sequelize como ORM.

São utilizados dois bancos:

| Ambiente        | Banco de dados |
| --------------- | -------------- |
| Desenvolvimento | `finbank`      |
| Testes          | `finbank_test` |

### Modelagem das tabelas

**Tabela `users`**

| Campo     | Descrição                |
| --------- | ------------------------ |
| id        | Identificador do usuário |
| name      | Nome                     |
| email     | E-mail                   |
| cpf       | CPF                      |
| password  | Senha criptografada      |
| createdAt | Data de criação          |
| updatedAt | Data de atualização      |

**Tabela `accounts`**

| Campo     | Descrição                     |
| --------- | ----------------------------- |
| id        | Identificador da conta        |
| userId    | Identificador do proprietário |
| number    | Número da conta               |
| type      | Tipo da conta                 |
| balance   | Saldo                         |
| createdAt | Data de criação               |
| updatedAt | Data de atualização           |

**Tabela `transactions`**

| Campo       | Descrição                  |
| ----------- | -------------------------- |
| id          | Identificador da transação |
| accountId   | Conta relacionada          |
| type        | Tipo da operação           |
| amount      | Valor da operação          |
| description | Descrição                  |
| status      | Status da transação        |
| createdAt   | Data de criação            |

### Relacionamentos

O banco de dados utiliza relacionamentos um-para-muitos (1:N):

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

- Um usuário pode possuir várias contas.
- Cada conta pertence a um usuário.
- Uma conta pode possuir várias transações.
- Cada transação está associada a uma conta.

## Instalação

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### 2. Entrar na pasta do projeto

```bash
cd finbank-api
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar o banco de dados

Certifique-se de que o MySQL esteja instalado e em execução.

Crie os bancos de dados:

```sql
CREATE DATABASE finbank;
CREATE DATABASE finbank_test;
```

## Configuração das variáveis de ambiente

O projeto utiliza arquivos de ambiente para armazenar configurações e credenciais.

Copie o arquivo de exemplo:

```bash
copy .env.example .env
copy .env.example .env.test
```

No Linux ou macOS, utilize:

```bash
cp .env.example .env
cp .env.example .env.test
```

Configure o arquivo `.env` para desenvolvimento:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=finbank
DB_USER=root
DB_PASSWORD=SUA_SENHA_MYSQL

JWT_SECRET=SUA_CHAVE_SECRETA_FORTE
JWT_EXPIRES_IN=1d
```

No arquivo `.env.test`, utilize as mesmas configurações, alterando o banco:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=finbank_test
DB_USER=root
DB_PASSWORD=SUA_SENHA_MYSQL

JWT_SECRET=SUA_CHAVE_SECRETA_DE_TESTES
JWT_EXPIRES_IN=1d
```

**Importante:**

- Substitua os valores de exemplo pelas configurações do seu ambiente.
- Utilize uma chave JWT aleatória e forte.
- Não compartilhe senhas ou chaves secretas.
- Os arquivos `.env` e `.env.test` não devem ser enviados ao GitHub.
- O arquivo `.env.example` contém apenas os nomes das variáveis necessárias.

## Migrations

As migrations são utilizadas para criar e atualizar a estrutura do banco de dados de maneira organizada e versionada.

Para executar as migrations no ambiente de desenvolvimento:

```bash
npx sequelize-cli db:migrate --env development
```

Para executar as migrations no ambiente de testes:

```bash
npx sequelize-cli db:migrate --env test
```

Para verificar o estado das migrations:

```bash
npx sequelize-cli db:migrate:status --env development
```

A migration `20261117000100-preserve-financial-history.js` atualiza as restrições das chaves estrangeiras para utilizar `ON DELETE RESTRICT`, impedindo a exclusão em cascata de registros financeiros.

## Executar a aplicação

### Modo desenvolvimento

```bash
npm run dev
```

### Modo produção

```bash
npm start
```

A API ficará disponível em:

```text
http://localhost:3000
```

## Documentação Swagger

A documentação interativa está disponível em:

```text
http://localhost:3000/api-docs
```

O Swagger permite consultar os endpoints, visualizar parâmetros, verificar respostas e testar as operações da API.

Para utilizar os endpoints protegidos:

1. Realize o login.
2. Copie o token JWT retornado.
3. Clique em **Authorize** na documentação Swagger.
4. Informe o token no formato:

```text
Bearer SEU_TOKEN_JWT
```

## Endpoints

### Autenticação

| Método | Endpoint         | Descrição         |
| ------ | ---------------- | ----------------- |
| POST   | `/auth/register` | Cadastrar usuário |
| POST   | `/auth/login`    | Realizar login    |

### Usuários

| Método | Endpoint     | Descrição             |
| ------ | ------------ | --------------------- |
| GET    | `/users`     | Listar usuários       |
| GET    | `/users/:id` | Buscar usuário por ID |
| POST   | `/users`     | Criar usuário         |
| PUT    | `/users/:id` | Atualizar usuário     |
| DELETE | `/users/:id` | Excluir usuário       |

### Contas bancárias

| Método | Endpoint        | Descrição           |
| ------ | --------------- | ------------------- |
| GET    | `/accounts`     | Listar contas       |
| GET    | `/accounts/:id` | Buscar conta por ID |
| POST   | `/accounts`     | Criar conta         |
| PUT    | `/accounts/:id` | Atualizar conta     |
| DELETE | `/accounts/:id` | Excluir conta       |

### Operações bancárias

| Método | Endpoint                 | Descrição         |
| ------ | ------------------------ | ----------------- |
| POST   | `/accounts/:id/deposit`  | Realizar depósito |
| POST   | `/accounts/:id/withdraw` | Realizar saque    |

### Transações

| Método | Endpoint                 | Descrição                                     |
| ------ | ------------------------ | --------------------------------------------- |
| GET    | `/transactions`          | Listar transações                             |
| GET    | `/transactions/:id`      | Buscar transação                              |
| POST   | `/transactions/transfer` | Realizar transferência                        |
| PUT    | `/transactions/:id`      | Atualizar descrição                           |
| DELETE | `/transactions/:id`      | Exclusão bloqueada para preservar o histórico |

**Observação:** as rotas de usuários, contas e transações exigem autenticação JWT. As rotas de cadastro e login são utilizadas para criar uma conta de acesso e autenticar o usuário.

## Autenticação JWT

Após realizar o login:

```http
POST /auth/login
```

A API retorna um token de autenticação.

Esse token deve ser enviado no cabeçalho das requisições protegidas:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

O middleware de autenticação verifica o token e identifica o usuário responsável pela requisição.

A autorização por proprietário impede que um usuário consulte ou manipule os dados de outro usuário.

## Exemplos de requisições

### Cadastro de usuário

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "cpf": "CPF_VALIDO_DE_TESTE",
  "password": "SENHA_DE_TESTE"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "joao@email.com",
  "password": "SENHA_DE_TESTE"
}
```

### Depósito

```http
POST /accounts/1/deposit
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

```json
{
  "amount": 500,
  "description": "Depósito inicial"
}
```

### Saque

```http
POST /accounts/1/withdraw
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

```json
{
  "amount": 200,
  "description": "Saque"
}
```

### Transferência

```http
POST /transactions/transfer
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json
```

```json
{
  "fromAccountId": 1,
  "toAccountId": 2,
  "amount": 250,
  "description": "Transferência"
}
```

Os identificadores utilizados nos exemplos devem corresponder a contas existentes e acessíveis no banco de dados.

## Paginação

As listagens utilizam paginação para evitar o retorno de grandes quantidades de registros em uma única requisição.

Exemplo:

```http
GET /accounts?page=1&limit=10
```

Parâmetros:

| Parâmetro | Descrição                          | Padrão |
| --------- | ---------------------------------- | ------ |
| page      | Página solicitada                  | 1      |
| limit     | Quantidade de registros por página | 10     |

O limite máximo permitido é de 100 registros por página.

As respostas paginadas seguem o formato:

```json
{
  "data": [],
  "pagination": {
    "totalItems": 0,
    "totalPages": 0,
    "currentPage": 1,
    "itemsPerPage": 10
  }
}
```

## Segurança e integridade financeira

O projeto implementa mecanismos para proteger os dados dos usuários e manter a consistência das operações bancárias.

Principais medidas:

- Senhas armazenadas com hash utilizando bcryptjs.
- Autenticação JWT.
- Proteção das rotas por middleware.
- Autorização baseada no proprietário dos recursos.
- Identificação do proprietário pelo token, sem confiar no `userId` enviado pelo cliente.
- Validação dos dados recebidos nas requisições.
- Operações financeiras executadas dentro de transações SQL.
- Bloqueio de linhas durante operações financeiras para reduzir condições de concorrência.
- Proteção contra saques superiores ao saldo disponível.
- Impedimento de transferências para a mesma conta.
- Restrição de alterações em informações financeiras.
- Preservação do histórico de transações.
- Impedimento de exclusão de contas com saldo ou histórico financeiro.
- Impedimento de exclusão de usuários com contas vinculadas.
- Chaves estrangeiras configuradas com `ON DELETE RESTRICT`.
- Variáveis de ambiente para armazenamento de credenciais e informações sensíveis.

## Testes automatizados

O projeto utiliza Jest e Supertest para testar os endpoints e os principais comportamentos da aplicação.

Os testes utilizam o banco de dados `finbank_test`.

### Executar os testes

```bash
npm test
```

### Executar em modo observação

```bash
npm run test:watch
```

### Executar com cobertura

```bash
npm run test:coverage
```

Os testes contemplam:

- Autenticação e login.
- Cadastro e gerenciamento de usuários.
- Criação e consulta de contas.
- Controle de acesso entre usuários.
- Depósitos.
- Saques.
- Validação de saldo insuficiente.
- Transferências.
- Validação de contas de origem e destino.
- Consulta e atualização de transações.
- Proteção do histórico financeiro.
- Autenticação obrigatória.
- Paginação das listagens.

## Scripts disponíveis

| Comando                 | Descrição                                    |
| ----------------------- | -------------------------------------------- |
| `npm run dev`           | Executa a aplicação em desenvolvimento       |
| `npm start`             | Executa a aplicação                          |
| `npm test`              | Executa os testes automatizados              |
| `npm run test:watch`    | Executa os testes em modo observação         |
| `npm run test:coverage` | Executa os testes com relatório de cobertura |

## Status HTTP utilizados

| Código | Significado           |
| ------ | --------------------- |
| 200    | OK                    |
| 201    | Created               |
| 204    | No Content            |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 404    | Not Found             |
| 409    | Conflict              |
| 500    | Internal Server Error |

## Objetivo do projeto

O FinBank API foi desenvolvido com objetivo educacional para praticar conceitos de desenvolvimento backend, arquitetura MVC, criação de APIs REST, autenticação e autorização, modelagem de bancos de dados relacionais, utilização de ORM, integridade de dados, operações financeiras transacionais, documentação e testes automatizados.

## Autor

**Gabriel Santos**
