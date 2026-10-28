const { Account, User } = require('../models');

const VALID_TYPES = ['checking', 'savings'];

async function createAccount(req, res) {
  try {
    const { userId, number, type, balance } = req.body;

    if (!userId || !number) {
      return res.status(400).json({
        message: 'userId e number são obrigatórios',
      });
    }

    if (type !== undefined && !VALID_TYPES.includes(type)) {
      return res.status(400).json({
        message: 'Tipo de conta deve ser checking ou savings',
      });
    }

    if (
      balance !== undefined &&
      (Number.isNaN(Number(balance)) || Number(balance) < 0)
    ) {
      return res.status(400).json({
        message: 'Saldo deve ser um número maior ou igual a zero',
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
      });
    }

    const existingAccount = await Account.findOne({
      where: { number },
    });

    if (existingAccount) {
      return res.status(400).json({
        message: 'Número da conta já cadastrado',
      });
    }

    const account = await Account.create({
      userId,
      number,
      type: type || 'checking',
      balance: balance !== undefined ? Number(balance) : 0,
    });

    return res.status(201).json(account);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao criar conta',
    });
  }
}

async function getAccounts(req, res) {
  try {
    const accounts = await Account.findAll();

    return res.status(200).json(accounts);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar contas',
    });
  }
}

async function getAccountById(req, res) {
  try {
    const account = await Account.findByPk(req.params.id);

    if (!account) {
      return res.status(404).json({
        message: 'Conta não encontrada',
      });
    }

    return res.status(200).json(account);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar conta',
    });
  }
}

async function updateAccount(req, res) {
  try {
    const { number, type } = req.body;

    const account = await Account.findByPk(req.params.id);

    if (!account) {
      return res.status(404).json({
        message: 'Conta não encontrada',
      });
    }

    if (type !== undefined && !VALID_TYPES.includes(type)) {
      return res.status(400).json({
        message: 'Tipo de conta deve ser checking ou savings',
      });
    }

    if (number && number !== account.number) {
      const existing = await Account.findOne({
        where: { number },
      });

      if (existing) {
        return res.status(400).json({
          message: 'Número da conta já cadastrado',
        });
      }
    }

    await account.update({
      number: number ?? account.number,
      type: type ?? account.type,
    });

    return res.status(200).json(account);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao atualizar conta',
    });
  }
}

async function deleteAccount(req, res) {
  try {
    const account = await Account.findByPk(req.params.id);

    if (!account) {
      return res.status(404).json({
        message: 'Conta não encontrada',
      });
    }

    await account.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao excluir conta',
    });
  }
}

module.exports = {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
};
