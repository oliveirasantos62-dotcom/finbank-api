const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'FinBank API',
      version: '1.0.0',
      description:
        'API bancária desenvolvida com Node.js, Express, Sequelize e MySQL.',
    },

    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],

    tags: [
      {
        name: 'Autenticação',
        description: 'Registro e autenticação de usuários',
      },
      {
        name: 'Usuários',
        description: 'Gerenciamento de usuários',
      },
      {
        name: 'Contas',
        description: 'Gerenciamento de contas bancárias',
      },
      {
        name: 'Operações Bancárias',
        description: 'Operações de depósito e saque',
      },
      {
        name: 'Transações',
        description: 'Gerenciamento de transações e transferências',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@email.com',
            },
            cpf: {
              type: 'string',
              example: '12345678901',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-10-28T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-10-28T12:00:00.000Z',
            },
          },
        },

        UserInput: {
          type: 'object',
          required: ['name', 'email', 'cpf', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'João Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@email.com',
            },
            cpf: {
              type: 'string',
              example: '12345678901',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: '123456',
            },
          },
        },

        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@email.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: '123456',
            },
          },
        },

        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login realizado com sucesso',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },

        Account: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            userId: {
              type: 'integer',
              example: 1,
            },
            number: {
              type: 'string',
              example: '00012345',
            },
            type: {
              type: 'string',
              enum: ['checking', 'savings'],
              example: 'checking',
            },
            balance: {
              type: 'number',
              format: 'double',
              example: 1500.5,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-10-28T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-10-28T12:00:00.000Z',
            },
          },
        },

        AccountInput: {
          type: 'object',
          required: ['userId', 'number'],
          properties: {
            userId: {
              type: 'integer',
              example: 1,
            },
            number: {
              type: 'string',
              example: '00012345',
            },
            type: {
              type: 'string',
              enum: ['checking', 'savings'],
              default: 'checking',
              example: 'checking',
            },
            balance: {
              type: 'number',
              format: 'double',
              minimum: 0,
              example: 1000,
            },
          },
        },

        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            accountId: {
              type: 'integer',
              example: 1,
            },
            type: {
              type: 'string',
              enum: ['deposit', 'withdraw', 'transfer'],
              example: 'deposit',
            },
            amount: {
              type: 'number',
              format: 'double',
              example: 500,
            },
            description: {
              type: 'string',
              example: 'Depósito inicial',
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'cancelled'],
              example: 'completed',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-10-28T12:00:00.000Z',
            },
          },
        },

        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Recurso não encontrado',
            },
          },
        },
      },
    },
  },

  apis: ['./src/routes/*.js'],
};

const swaggerDocument = swaggerJsdoc(options);

swaggerDocument.paths = {
  '/auth/register': {
    post: {
      tags: ['Autenticação'],
      summary: 'Registrar usuário',
      description: 'Cria um novo usuário no FinBank.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Usuário criado com sucesso',
        },
        400: {
          description: 'Dados inválidos ou usuário já cadastrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },

  '/auth/login': {
    post: {
      tags: ['Autenticação'],
      summary: 'Realizar login',
      description: 'Autentica o usuário e retorna um token JWT.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login realizado com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponse',
              },
            },
          },
        },
        400: {
          description: 'Dados obrigatórios não informados',
        },
        401: {
          description: 'E-mail ou senha inválidos',
        },
      },
    },
  },

  '/users': {
    get: {
      tags: ['Usuários'],
      summary: 'Listar usuários',
      responses: {
        200: {
          description: 'Lista de usuários',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          },
        },
      },
    },

    post: {
      tags: ['Usuários'],
      summary: 'Criar usuário',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Usuário criado com sucesso',
        },
        400: {
          description: 'Dados inválidos',
        },
        401: {
          description: 'Token inválido ou ausente',
        },
      },
    },
  },

  '/users/{id}': {
    get: {
      tags: ['Usuários'],
      summary: 'Buscar usuário por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID do usuário',
          schema: {
            type: 'integer',
          },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Usuário encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
        404: {
          description: 'Usuário não encontrado',
        },
      },
    },

    put: {
      tags: ['Usuários'],
      summary: 'Atualizar usuário',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID do usuário',
          schema: {
            type: 'integer',
          },
          example: 1,
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Usuário atualizado com sucesso',
        },
        400: {
          description: 'Dados inválidos',
        },
        401: {
          description: 'Token inválido ou ausente',
        },
        404: {
          description: 'Usuário não encontrado',
        },
      },
    },

    delete: {
      tags: ['Usuários'],
      summary: 'Excluir usuário',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID do usuário',
          schema: {
            type: 'integer',
          },
          example: 1,
        },
      ],
      responses: {
        204: {
          description: 'Usuário excluído com sucesso',
        },
        401: {
          description: 'Token inválido ou ausente',
        },
        404: {
          description: 'Usuário não encontrado',
        },
      },
    },
  },

  '/accounts': {
    get: {
      tags: ['Contas'],
      summary: 'Listar contas',
      responses: {
        200: {
          description: 'Lista de contas',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Account',
                },
              },
            },
          },
        },
      },
    },

    post: {
      tags: ['Contas'],
      summary: 'Criar conta',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AccountInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Conta criada com sucesso',
        },
        400: {
          description: 'Dados inválidos',
        },
        401: {
          description: 'Token inválido ou ausente',
        },
        404: {
          description: 'Usuário não encontrado',
        },
      },
    },
  },

  '/accounts/{id}': {
    get: {
      tags: ['Contas'],
      summary: 'Buscar conta por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da conta',
          schema: {
            type: 'integer',
          },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Conta encontrada',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Account',
              },
            },
          },
        },
        404: {
          description: 'Conta não encontrada',
        },
      },
    },

    put: {
      tags: ['Contas'],
      summary: 'Atualizar conta',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da conta',
          schema: {
            type: 'integer',
          },
          example: 1,
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/AccountInput',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Conta atualizada com sucesso',
        },
        400: {
          description: 'Dados inválidos',
        },
        401: {
          description: 'Token inválido ou ausente',
        },
        404: {
          description: 'Conta não encontrada',
        },
      },
    },

    delete: {
      tags: ['Contas'],
      summary: 'Excluir conta',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da conta',
          schema: {
            type: 'integer',
          },
          example: 1,
        },
      ],
      responses: {
        204: {
          description: 'Conta excluída com sucesso',
        },
        401: {
          description: 'Token inválido ou ausente',
        },
        404: {
          description: 'Conta não encontrada',
        },
      },
    },
  },

  '/accounts/{id}/deposit': {
    post: {
      tags: ['Operações Bancárias'],
      summary: 'Realizar depósito',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da conta',
          schema: {
            type: 'integer',
          },
          example: 1,
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['amount'],
              properties: {
                amount: {
                  type: 'number',
                  format: 'double',
                  minimum: 0.01,
                  example: 500,
                },
                description: {
                  type: 'string',
                  example: 'Depósito inicial',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Depósito realizado com sucesso',
        },
        400: {
          description: 'Valor inválido',
        },
        401: {
          description: 'Token inválido ou ausente',
        },
        404: {
          description: 'Conta não encontrada',
        },
      },
    },
  },

  '/accounts/{id}/withdraw': {
    post: {
      tags: ['Operações Bancárias'],
      summary: 'Realizar saque',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da conta',
          schema: {
            type: 'integer',
          },
          example: 1,
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['amount'],
              properties: {
                amount: {
                  type: 'number',
                  format: 'double',
                  minimum: 0.01,
                  example: 200,
                },
                description: {
                  type: 'string',
                  example: 'Saque',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Saque realizado com sucesso',
        },
        400: {
          description: 'Valor inválido ou saldo insuficiente',
        },
        401: {
          description: 'Token inválido ou ausente',
        },
        404: {
          description: 'Conta não encontrada',
        },
      },
    },
  },

  '/transactions': {
    get: {
      tags: ['Transações'],
      summary: 'Listar transações',
      responses: {
        200: {
          description: 'Lista de transações',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Transaction',
                },
              },
            },
          },
        },
      },
    },
  },

  '/transactions/{id}': {
    get: {
      tags: ['Transações'],
      summary: 'Buscar transação por ID',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da transação',
          schema: {
            type: 'integer',
          },
          example: 1,
        },
      ],
      responses: {
        200: {
          description: 'Transação encontrada',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Transaction',
              },
            },
          },
        },
        404: {
          description: 'Transação não encontrada',
        },
      },
    },

    put: {
      tags: ['Transações'],
      summary: 'Atualizar transação',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da transação',
          schema: {
            type: 'integer',
          },
          example: 1,
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['pending', 'completed', 'cancelled'],
                  example: 'completed',
                },
                description: {
                  type: 'string',
                  example: 'Transação atualizada',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Transação atualizada com sucesso',
        },
        400: {
          description: 'Status inválido',
        },
        401: {
          description: 'Token inválido ou ausente',
        },
        404: {
          description: 'Transação não encontrada',
        },
      },
    },

    delete: {
      tags: ['Transações'],
      summary: 'Excluir transação',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ID da transação',
          schema: {
            type: 'integer',
          },
          example: 1,
        },
      ],
      responses: {
        204: {
          description: 'Transação excluída com sucesso',
        },
        401: {
          description: 'Token inválido ou ausente',
        },
        404: {
          description: 'Transação não encontrada',
        },
      },
    },
  },

  '/transactions/transfer': {
    post: {
      tags: ['Transações'],
      summary: 'Realizar transferência',
      description:
        'Transfere um valor de uma conta para outra utilizando uma transação do banco de dados.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['fromAccountId', 'toAccountId', 'amount'],
              properties: {
                fromAccountId: {
                  type: 'integer',
                  example: 1,
                },
                toAccountId: {
                  type: 'integer',
                  example: 2,
                },
                amount: {
                  type: 'number',
                  format: 'double',
                  minimum: 0.01,
                  example: 250,
                },
                description: {
                  type: 'string',
                  example: 'Transferência entre contas',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Transferência realizada com sucesso',
        },
        400: {
          description: 'Dados inválidos, contas iguais ou saldo insuficiente',
        },
        401: {
          description: 'Token inválido ou ausente',
        },
        404: {
          description: 'Conta não encontrada',
        },
      },
    },
  },
};

module.exports = swaggerDocument;
