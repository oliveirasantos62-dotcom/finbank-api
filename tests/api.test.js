process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../src/app');
const sequelize = require('../src/config/database');

const { User, Account, Transaction } = require('../src/models');

let userId;
let accountId;
let secondAccountId;
let transactionId;

describe('FinBank API', () => {
  beforeAll(async () => {
    await sequelize.authenticate();

    await Transaction.destroy({
      where: {},
    });

    await Account.destroy({
      where: {},
    });

    await User.destroy({
      where: {},
    });

    const response = await request(app).post('/auth/register').send({
      name: 'Usuário Teste',
      email: 'teste@jest.com',
      cpf: '11111111111',
      password: '123456',
    });

    expect(response.statusCode).toBe(201);

    userId = response.body.user.id;
  });

  afterAll(async () => {
    await Transaction.destroy({
      where: {},
    });

    await Account.destroy({
      where: {},
    });

    await User.destroy({
      where: {},
    });

    await sequelize.close();
  });

  describe('Autenticação', () => {
    test('deve realizar login', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'teste@jest.com',
        password: '123456',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
    });
  });

  describe('Usuários', () => {
    test('deve listar usuários', async () => {
      const response = await request(app).get('/users');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('deve buscar usuário pelo ID', async () => {
      const response = await request(app).get(`/users/${userId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(userId);
      expect(response.body.email).toBe('teste@jest.com');
    });

    test('deve retornar 404 para usuário inexistente', async () => {
      const response = await request(app).get('/users/999999');

      expect(response.statusCode).toBe(404);
    });

    test('deve atualizar usuário', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'teste@jest.com',
        password: '123456',
      });

      const token = loginResponse.body.token;

      const response = await request(app)
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Usuário Teste Atualizado',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.user.name).toBe('Usuário Teste Atualizado');
    });
  });

  describe('Contas', () => {
    test('deve criar uma conta', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'teste@jest.com',
        password: '123456',
      });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId,
          number: 'JEST00001',
          type: 'checking',
          balance: 1000,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.number).toBe('JEST00001');

      accountId = response.body.id;
    });

    test('deve criar uma segunda conta', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'teste@jest.com',
        password: '123456',
      });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/accounts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId,
          number: 'JEST00002',
          type: 'checking',
          balance: 500,
        });

      expect(response.statusCode).toBe(201);

      secondAccountId = response.body.id;
    });

    test('deve listar contas', async () => {
      const response = await request(app).get('/accounts');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('deve buscar conta pelo ID', async () => {
      const response = await request(app).get(`/accounts/${accountId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(accountId);
    });
  });

  describe('Operações bancárias', () => {
    test('deve realizar depósito', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'teste@jest.com',
        password: '123456',
      });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post(`/accounts/${accountId}/deposit`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 500,
          description: 'Depósito Jest',
        });

      expect(response.statusCode).toBe(200);
      expect(Number(response.body.account.balance)).toBe(1500);
    });

    test('deve realizar saque', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'teste@jest.com',
        password: '123456',
      });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post(`/accounts/${accountId}/withdraw`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 300,
          description: 'Saque Jest',
        });

      expect(response.statusCode).toBe(200);
      expect(Number(response.body.account.balance)).toBe(1200);
    });

    test('não deve permitir saque maior que o saldo', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'teste@jest.com',
        password: '123456',
      });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post(`/accounts/${accountId}/withdraw`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 99999,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Saldo insuficiente');
    });

    test('não deve permitir depósito negativo', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'teste@jest.com',
        password: '123456',
      });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post(`/accounts/${accountId}/deposit`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: -100,
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('Transferências', () => {
    test('deve realizar transferência', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'teste@jest.com',
        password: '123456',
      });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/transactions/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fromAccountId: accountId,
          toAccountId: secondAccountId,
          amount: 200,
          description: 'Transferência Jest',
        });

      expect(response.statusCode).toBe(200);

      transactionId = response.body.transaction.id;

      expect(Number(response.body.fromAccount.balance)).toBe(1000);

      expect(Number(response.body.toAccount.balance)).toBe(700);
    });

    test('não deve permitir transferência para a mesma conta', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'teste@jest.com',
        password: '123456',
      });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/transactions/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fromAccountId: accountId,
          toAccountId: accountId,
          amount: 100,
        });

      expect(response.statusCode).toBe(400);
    });

    test('não deve permitir transferência sem saldo', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'teste@jest.com',
        password: '123456',
      });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/transactions/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({
          fromAccountId: accountId,
          toAccountId: secondAccountId,
          amount: 99999,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Saldo insuficiente');
    });
  });

  describe('Transações', () => {
    test('deve listar transações', async () => {
      const response = await request(app).get('/transactions');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('deve buscar transação pelo ID', async () => {
      const response = await request(app).get(`/transactions/${transactionId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(transactionId);
    });

    test('deve retornar 404 para transação inexistente', async () => {
      const response = await request(app).get('/transactions/999999');

      expect(response.statusCode).toBe(404);
    });

    test('deve atualizar uma transação', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'teste@jest.com',
        password: '123456',
      });

      const token = loginResponse.body.token;

      const response = await request(app)
        .put(`/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Transferência atualizada',
          status: 'completed',
        });

      expect(response.statusCode).toBe(200);

      expect(response.body.description).toBe('Transferência atualizada');
    });

    test('deve excluir uma transação', async () => {
      const loginResponse = await request(app).post('/auth/login').send({
        email: 'teste@jest.com',
        password: '123456',
      });

      const token = loginResponse.body.token;

      const response = await request(app)
        .delete(`/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(204);
    });
  });
});
