const { Account, Transaction } = require('../models');

function validateAmount(amount) {
  if (
    amount === null ||
    amount === undefined ||
    amount === '' ||
    Number.isNaN(Number(amount)) ||
    Number(amount) <= 0
  ) {
    return false;
  }

  return true;
}

async function deposit(req, res) {
  try {
    const { amount, description } = req.body;

    if (!validateAmount(amount)) {
      return res.status(400).json({
        message: 'O valor do depósito deve ser maior que zero',
      });
    }

    const account = await Account.findByPk(req.params.id);

    if (!account) {
      return res.status(404).json({
        message: 'Conta não encontrada',
      });
    }

    const newBalance = Number(account.balance) + Number(amount);

    await account.update({
      balance: newBalance,
    });

    const transaction = await Transaction.create({
      accountId: account.id,
      type: 'deposit',
      amount: Number(amount),
      description: description || 'Depósito',
      status: 'completed',
    });

    return res.status(200).json({
      message: 'Depósito realizado com sucesso',
      account: {
        id: account.id,
        number: account.number,
        balance: account.balance,
      },
      transaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao realizar depósito',
    });
  }
}

async function withdraw(req, res) {
  try {
    const { amount, description } = req.body;

    if (!validateAmount(amount)) {
      return res.status(400).json({
        message: 'O valor do saque deve ser maior que zero',
      });
    }

    const account = await Account.findByPk(req.params.id);

    if (!account) {
      return res.status(404).json({
        message: 'Conta não encontrada',
      });
    }

    if (Number(amount) > Number(account.balance)) {
      return res.status(400).json({
        message: 'Saldo insuficiente',
      });
    }

    const newBalance = Number(account.balance) - Number(amount);

    await account.update({
      balance: newBalance,
    });

    const transaction = await Transaction.create({
      accountId: account.id,
      type: 'withdraw',
      amount: Number(amount),
      description: description || 'Saque',
      status: 'completed',
    });

    return res.status(200).json({
      message: 'Saque realizado com sucesso',
      account: {
        id: account.id,
        number: account.number,
        balance: account.balance,
      },
      transaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao realizar saque',
    });
  }
}

module.exports = {
  deposit,
  withdraw,
};
