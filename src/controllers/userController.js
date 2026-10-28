const bcrypt = require('bcryptjs');

const { User } = require('../models');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidCpf(cpf) {
  return /^\d{11}$/.test(cpf);
}

async function createUser(req, res) {
  try {
    const { name, email, cpf, password } = req.body;

    if (!name || !email || !cpf || !password) {
      return res.status(400).json({
        message: 'Todos os campos são obrigatórios',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'E-mail inválido',
      });
    }

    if (!isValidCpf(cpf)) {
      return res.status(400).json({
        message: 'CPF deve conter 11 números',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'A senha deve ter pelo menos 6 caracteres',
      });
    }

    const existingEmail = await User.findOne({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({
        message: 'E-mail já cadastrado',
      });
    }

    const existingCpf = await User.findOne({
      where: { cpf },
    });

    if (existingCpf) {
      return res.status(400).json({
        message: 'CPF já cadastrado',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      cpf,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao criar usuário',
    });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password'],
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar usuários',
    });
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao buscar usuário',
    });
  }
}

async function updateUser(req, res) {
  try {
    const { name, email, cpf, password } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
      });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        message: 'E-mail inválido',
      });
    }

    if (cpf && !isValidCpf(cpf)) {
      return res.status(400).json({
        message: 'CPF deve conter 11 números',
      });
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        where: { email },
      });

      if (existingEmail) {
        return res.status(400).json({
          message: 'E-mail já cadastrado',
        });
      }
    }

    if (cpf && cpf !== user.cpf) {
      const existingCpf = await User.findOne({
        where: { cpf },
      });

      if (existingCpf) {
        return res.status(400).json({
          message: 'CPF já cadastrado',
        });
      }
    }

    let hashedPassword = user.password;

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: 'A senha deve ter pelo menos 6 caracteres',
        });
      }

      hashedPassword = await bcrypt.hash(password, 10);
    }

    await user.update({
      name: name ?? user.name,
      email: email ?? user.email,
      cpf: cpf ?? user.cpf,
      password: hashedPassword,
    });

    return res.status(200).json({
      message: 'Usuário atualizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao atualizar usuário',
    });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'Usuário não encontrado',
      });
    }

    await user.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      message: 'Erro ao excluir usuário',
    });
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
