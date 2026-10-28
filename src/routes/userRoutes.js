const express = require('express');

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);

router.post('/', authMiddleware, createUser);

router.put('/:id', authMiddleware, updateUser);

router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
