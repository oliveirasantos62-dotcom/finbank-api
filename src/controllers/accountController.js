const { Op } = require('sequelize');
const { Account, User, Transaction } = require('../models');
const { getPagination, paginationMeta } = require('../utils/pagination');

const VALID_TYPES = ['checking', 'savings'];

async function createAccount(req, res) {
  try {
    const { number, type, balance } = req.body;
    if (!number) return res.status(400).json({ message: 'number é obrigatório' });
    if (type !== undefined && !VALID_TYPES.includes(type)) return res.status(400).json({ message: 'Tipo de conta deve ser checking ou savings' });
    if (balance !== undefined && (balance === '' || !Number.isFinite(Number(balance)) || Number(balance) < 0)) return res.status(400).json({ message: 'Saldo deve ser um número maior ou igual a zero' });
    const existing = await Account.findOne({ where: { number } });
    if (existing) return res.status(400).json({ message: 'Número da conta já cadastrado' });
    const account = await Account.create({ userId: req.user.id, number, type: type || 'checking', balance: balance === undefined ? 0 : Number(balance) });
    return res.status(201).json(account);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar conta' });
  }
}

async function getAccounts(req, res) {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const result = await Account.findAndCountAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']], limit, offset });
    return res.status(200).json({ data: result.rows, pagination: paginationMeta(result.count, page, limit) });
  } catch (error) { return res.status(500).json({ message: 'Erro ao buscar contas' }); }
}

async function getAccountById(req, res) {
  try {
    const account = await Account.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!account) return res.status(404).json({ message: 'Conta não encontrada' });
    return res.status(200).json(account);
  } catch (error) { return res.status(500).json({ message: 'Erro ao buscar conta' }); }
}

async function updateAccount(req, res) {
  try {
    const { number, type } = req.body;
    const account = await Account.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!account) return res.status(404).json({ message: 'Conta não encontrada' });
    if (type !== undefined && !VALID_TYPES.includes(type)) return res.status(400).json({ message: 'Tipo de conta deve ser checking ou savings' });
    if (number && number !== account.number) {
      const existing = await Account.findOne({ where: { number, id: { [Op.ne]: account.id } } });
      if (existing) return res.status(400).json({ message: 'Número da conta já cadastrado' });
    }
    await account.update({ number: number ?? account.number, type: type ?? account.type });
    return res.status(200).json(account);
  } catch (error) { return res.status(500).json({ message: 'Erro ao atualizar conta' }); }
}

async function deleteAccount(req, res) {
  try {
    const account = await Account.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!account) return res.status(404).json({ message: 'Conta não encontrada' });
    const historyCount = await Transaction.count({ where: { accountId: account.id } });
    if (historyCount > 0 || Number(account.balance) !== 0) return res.status(409).json({ message: 'A conta possui saldo ou histórico financeiro e não pode ser excluída' });
    await account.destroy();
    return res.status(204).send();
  } catch (error) { return res.status(500).json({ message: 'Erro ao excluir conta' }); }
}

module.exports = { createAccount, getAccounts, getAccountById, updateAccount, deleteAccount };
