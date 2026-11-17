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

router.use(authMiddleware);

router.get('/', getAccounts);
router.get('/:id', getAccountById);

router.post('/', createAccount);

router.put('/:id', updateAccount);

router.delete('/:id', deleteAccount);

module.exports = router;
