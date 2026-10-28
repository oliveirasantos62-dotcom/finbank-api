const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { Account, Transaction } = require('../models');

const VALID_STATUSES = ['pending', 'completed', 'cancelled'];

async function getTransactions(req, res) {
  try {
    const transactions = await Transaction.findAll({
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar transações',
      error: error.message,
    });
  }
}

async function getTransactionById(req, res) {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({
        message: 'Transação não encontrada',
      });
    }

    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar transação',
      error: error.message,
    });
  }
}

async function transfer(req, res) {
  const dbTransaction = await sequelize.transaction();

  try {
    const { fromAccountId, toAccountId, amount, description } = req.body;

    // ==========================================
    // 1. Validar campos obrigatórios
    // ==========================================
    if (
      !fromAccountId ||
      !toAccountId ||
      amount === undefined ||
      amount === null
    ) {
      await dbTransaction.rollback();

      return res.status(400).json({
        message: 'fromAccountId, toAccountId e amount são obrigatórios',
      });
    }

    // ==========================================
    // 2. Converter e validar valor
    // ==========================================
    const transferAmount = Number(amount);

    if (Number.isNaN(transferAmount) || transferAmount <= 0) {
      await dbTransaction.rollback();

      return res.status(400).json({
        message: 'O valor da transferência deve ser maior que zero',
      });
    }

    // ==========================================
    // 3. Converter IDs
    // ==========================================
    const fromId = Number(fromAccountId);
    const toId = Number(toAccountId);

    // ==========================================
    // 4. Validar IDs
    // ==========================================
    if (Number.isNaN(fromId) || Number.isNaN(toId)) {
      await dbTransaction.rollback();

      return res.status(400).json({
        message: 'Os IDs das contas devem ser números válidos',
      });
    }

    // ==========================================
    // 5. Impedir transferência para a mesma conta
    // ==========================================
    if (fromId === toId) {
      await dbTransaction.rollback();

      return res.status(400).json({
        message: 'A conta de origem e destino devem ser diferentes',
      });
    }

    // ==========================================
    // 6. Buscar contas com bloqueio
    // ==========================================
    const accounts = await Account.findAll({
      where: {
        id: {
          [Op.in]: [fromId, toId],
        },
      },
      transaction: dbTransaction,
      lock: dbTransaction.LOCK.UPDATE,
    });

    // ==========================================
    // 7. Verificar se as duas contas existem
    // ==========================================
    if (accounts.length !== 2) {
      await dbTransaction.rollback();

      return res.status(404).json({
        message: 'Conta de origem ou destino não encontrada',
      });
    }

    const fromAccount = accounts.find((account) => account.id === fromId);

    const toAccount = accounts.find((account) => account.id === toId);

    // ==========================================
    // 8. Verificar saldo
    // ==========================================
    if (transferAmount > Number(fromAccount.balance)) {
      await dbTransaction.rollback();

      return res.status(400).json({
        message: 'Saldo insuficiente',
      });
    }

    // ==========================================
    // 9. Retirar dinheiro da conta de origem
    // ==========================================
    await fromAccount.update(
      {
        balance: Number(fromAccount.balance) - transferAmount,
      },
      {
        transaction: dbTransaction,
      },
    );

    // ==========================================
    // 10. Adicionar dinheiro na conta destino
    // ==========================================
    await toAccount.update(
      {
        balance: Number(toAccount.balance) + transferAmount,
      },
      {
        transaction: dbTransaction,
      },
    );

    // ==========================================
    // 11. Registrar transferência
    // ==========================================
    const transferTransaction = await Transaction.create(
      {
        accountId: fromAccount.id,
        type: 'transfer',
        amount: transferAmount,
        description:
          description || `Transferência para conta ${toAccount.number}`,
        status: 'completed',
      },
      {
        transaction: dbTransaction,
      },
    );

    // ==========================================
    // 12. Confirmar transação
    // ==========================================
    await dbTransaction.commit();

    return res.status(200).json({
      message: 'Transferência realizada com sucesso',

      fromAccount: {
        id: fromAccount.id,
        number: fromAccount.number,
        balance: fromAccount.balance,
      },

      toAccount: {
        id: toAccount.id,
        number: toAccount.number,
        balance: toAccount.balance,
      },

      transaction: transferTransaction,
    });
  } catch (error) {
    await dbTransaction.rollback();

    return res.status(500).json({
      message: 'Erro ao realizar transferência',
      error: error.message,
    });
  }
}

async function updateTransaction(req, res) {
  try {
    const { description, status } = req.body;

    const transaction = await Transaction.findByPk(req.params.id);

    // ==========================================
    // 1. Verificar se existe
    // ==========================================
    if (!transaction) {
      return res.status(404).json({
        message: 'Transação não encontrada',
      });
    }

    // ==========================================
    // 2. Validar status
    // ==========================================
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: 'Status deve ser pending, completed ou cancelled',
      });
    }

    // ==========================================
    // 3. Atualizar
    // ==========================================
    await transaction.update({
      description: description ?? transaction.description,

      status: status ?? transaction.status,
    });

    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao atualizar transação',
    });
  }
}

async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({
        message: 'Transação não encontrada',
      });
    }

    await transaction.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao excluir transação',
      error: error.message,
    });
  }
}

module.exports = {
  getTransactions,
  getTransactionById,
  transfer,
  updateTransaction,
  deleteTransaction,
};
