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

router.use(authMiddleware);
router.get('/', getTransactions);
router.get('/:id', getTransactionById);
router.post('/transfer', transfer);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
