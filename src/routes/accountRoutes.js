const express = require('express');

const {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
} = require('../controllers/accountController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAccounts);
router.get('/:id', getAccountById);

router.post('/', authMiddleware, createAccount);

router.put('/:id', authMiddleware, updateAccount);

router.delete('/:id', authMiddleware, deleteAccount);

module.exports = router;
