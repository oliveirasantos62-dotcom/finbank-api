const express = require('express');

const { deposit, withdraw } = require('../controllers/bankingController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:id/deposit', authMiddleware, deposit);

router.post('/:id/withdraw', authMiddleware, withdraw);

module.exports = router;
