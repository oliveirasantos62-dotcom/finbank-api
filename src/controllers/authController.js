const jwt = require('jsonwebtoken');

const { registerUser, loginUser } = require('../services/authService');

async function register(req, res) {
  try {
    const { name, email, cpf, password } = req.body;

    if (!name || !email || !cpf || !password) {
      return res.status(400).json({
        message: 'Todos os campos são obrigatórios',
      });
    }

    const user = await registerUser({
      name,
      email,
      cpf,
      password,
    });

    return res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (
      error.message === 'E-mail já cadastrado' ||
      error.message === 'CPF já cadastrado'
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: 'Erro ao registrar usuário',
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'E-mail e senha são obrigatórios',
      });
    }

    const user = await loginUser({
      email,
      password,
    });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não configurado');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      },
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
      },
    });
  } catch (error) {
    if (error.message === 'E-mail ou senha inválidos') {
      return res.status(401).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: 'Erro ao realizar login',
    });
  }
}

module.exports = {
  register,
  login,
};
