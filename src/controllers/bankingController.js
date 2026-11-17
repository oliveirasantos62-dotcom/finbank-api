const sequelize = require('../config/database');
const { Account, Transaction } = require('../models');

function validateAmount(amount) {
  return amount !== null && amount !== undefined && amount !== '' && Number.isFinite(Number(amount)) && Number(amount) > 0;
}

async function executeBalanceOperation(req, res, operation) {
  const dbTransaction = await sequelize.transaction();
  try {
    const { amount, description } = req.body;
    if (!validateAmount(amount)) {
      await dbTransaction.rollback();
      return res.status(400).json({ message: `O valor do ${operation === 'deposit' ? 'depósito' : 'saque'} deve ser maior que zero` });
    }
    const account = await Account.findOne({ where: { id: req.params.id, userId: req.user.id }, transaction: dbTransaction, lock: dbTransaction.LOCK.UPDATE });
    if (!account) {
      await dbTransaction.rollback();
      return res.status(404).json({ message: 'Conta não encontrada' });
    }
    const current = Number(account.balance);
    const value = Number(amount);
    if (operation === 'withdraw' && value > current) {
      await dbTransaction.rollback();
      return res.status(400).json({ message: 'Saldo insuficiente' });
    }
    const nextBalance = operation === 'deposit' ? current + value : current - value;
    await account.update({ balance: nextBalance }, { transaction: dbTransaction });
    const transactionRecord = await Transaction.create({ accountId: account.id, type: operation, amount: value, description: description || (operation === 'deposit' ? 'Depósito' : 'Saque'), status: 'completed' }, { transaction: dbTransaction });
    await dbTransaction.commit();
    return res.status(200).json({ message: operation === 'deposit' ? 'Depósito realizado com sucesso' : 'Saque realizado com sucesso', account: { id: account.id, number: account.number, balance: account.balance }, transaction: transactionRecord });
  } catch (error) {
    if (!dbTransaction.finished) await dbTransaction.rollback();
    return res.status(500).json({ message: 'Erro ao realizar operação bancária' });
  }
}

async function deposit(req, res) { return executeBalanceOperation(req, res, 'deposit'); }
async function withdraw(req, res) { return executeBalanceOperation(req, res, 'withdraw'); }
module.exports = { deposit, withdraw };
