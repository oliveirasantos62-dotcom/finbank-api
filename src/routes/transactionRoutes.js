const express = require('express');

const {
  getTransactions,
  getTransactionById,
  transfer,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getTransactions);
router.get('/:id', getTransactionById);

router.post('/transfer', authMiddleware, transfer);

router.put('/:id', authMiddleware, updateTransaction);

router.delete('/:id', authMiddleware, deleteTransaction);

module.exports = router;
