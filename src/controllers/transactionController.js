const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { Account, Transaction } = require('../models');
const { getPagination, paginationMeta } = require('../utils/pagination');

async function getTransactions(req, res) {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const result = await Transaction.findAndCountAll({
      include: [{ model: Account, as: 'account', attributes: [], where: { userId: req.user.id } }],
      order: [['createdAt', 'DESC']], limit, offset, distinct: true,
    });
    return res.status(200).json({ data: result.rows, pagination: paginationMeta(result.count, page, limit) });
  } catch (error) { return res.status(500).json({ message: 'Erro ao buscar transações' }); }
}

async function getTransactionById(req, res) {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id },
      include: [{ model: Account, as: 'account', attributes: [], where: { userId: req.user.id } }],
    });
    if (!transaction) return res.status(404).json({ message: 'Transação não encontrada' });
    return res.status(200).json(transaction);
  } catch (error) { return res.status(500).json({ message: 'Erro ao buscar transação' }); }
}

async function transfer(req, res) {
  const dbTransaction = await sequelize.transaction();
  try {
    const { fromAccountId, toAccountId, amount, description } = req.body;
    const fromId = Number(fromAccountId);
    const toId = Number(toAccountId);
    const value = Number(amount);
    if (!fromAccountId || !toAccountId || amount === undefined || amount === null || amount === '' || !Number.isInteger(fromId) || !Number.isInteger(toId) || !Number.isFinite(value) || value <= 0) {
      await dbTransaction.rollback();
      return res.status(400).json({ message: 'Informe IDs válidos e um valor maior que zero' });
    }
    if (fromId === toId) {
      await dbTransaction.rollback();
      return res.status(400).json({ message: 'A conta de origem e destino devem ser diferentes' });
    }
    const accounts = await Account.findAll({ where: { id: { [Op.in]: [fromId, toId] } }, order: [['id', 'ASC']], transaction: dbTransaction, lock: dbTransaction.LOCK.UPDATE });
    if (accounts.length !== 2) {
      await dbTransaction.rollback();
      return res.status(404).json({ message: 'Conta de origem ou destino não encontrada' });
    }
    const fromAccount = accounts.find((account) => account.id === fromId);
    const toAccount = accounts.find((account) => account.id === toId);
    if (fromAccount.userId !== Number(req.user.id)) {
      await dbTransaction.rollback();
      return res.status(404).json({ message: 'Conta de origem não encontrada' });
    }
    if (value > Number(fromAccount.balance)) {
      await dbTransaction.rollback();
      return res.status(400).json({ message: 'Saldo insuficiente' });
    }
    await fromAccount.update({ balance: Number(fromAccount.balance) - value }, { transaction: dbTransaction });
    await toAccount.update({ balance: Number(toAccount.balance) + value }, { transaction: dbTransaction });
    const record = await Transaction.create({ accountId: fromAccount.id, type: 'transfer', amount: value, description: description || `Transferência para conta ${toAccount.number}`, status: 'completed' }, { transaction: dbTransaction });
    await dbTransaction.commit();
    return res.status(200).json({ message: 'Transferência realizada com sucesso', fromAccount: { id: fromAccount.id, number: fromAccount.number, balance: fromAccount.balance }, toAccount: { id: toAccount.id, number: toAccount.number, balance: toAccount.balance }, transaction: record });
  } catch (error) {
    if (!dbTransaction.finished) await dbTransaction.rollback();
    return res.status(500).json({ message: 'Erro ao realizar transferência' });
  }
}

async function updateTransaction(req, res) {
  try {
    const { description, status, amount, type, accountId } = req.body;
    if (status !== undefined || amount !== undefined || type !== undefined || accountId !== undefined) {
      return res.status(409).json({ message: 'Dados financeiros e status são imutáveis para preservar o histórico. Apenas a descrição pode ser alterada.' });
    }
    const transaction = await Transaction.findOne({
      where: { id: req.params.id },
      include: [{ model: Account, as: 'account', attributes: [], where: { userId: req.user.id } }],
    });
    if (!transaction) return res.status(404).json({ message: 'Transação não encontrada' });
    await transaction.update({ description: description ?? transaction.description });
    return res.status(200).json(transaction);
  } catch (error) { return res.status(500).json({ message: 'Erro ao atualizar transação' }); }
}

async function deleteTransaction(req, res) {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id },
      include: [{ model: Account, as: 'account', attributes: [], where: { userId: req.user.id } }],
    });
    if (!transaction) return res.status(404).json({ message: 'Transação não encontrada' });
    return res.status(409).json({ message: 'Transações financeiras não podem ser excluídas; o histórico deve ser preservado.' });
  } catch (error) { return res.status(500).json({ message: 'Erro ao excluir transação' }); }
}

module.exports = { getTransactions, getTransactionById, transfer, updateTransaction, deleteTransaction };
