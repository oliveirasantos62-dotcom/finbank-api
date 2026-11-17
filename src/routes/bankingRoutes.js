const express = require('express');

const { deposit, withdraw } = require('../controllers/bankingController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/:id/deposit', deposit);
router.post('/:id/withdraw', withdraw);

module.exports = router;
