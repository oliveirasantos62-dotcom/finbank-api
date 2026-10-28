const bcrypt = require('bcryptjs');

const { User } = require('../models');

async function registerUser({ name, email, cpf, password }) {
  const existingEmail = await User.findOne({
    where: { email },
  });

  if (existingEmail) {
    throw new Error('E-mail já cadastrado');
  }

  const existingCpf = await User.findOne({
    where: { cpf },
  });

  if (existingCpf) {
    throw new Error('CPF já cadastrado');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    cpf,
    password: hashedPassword,
  });

  return user;
}

async function loginUser({ email, password }) {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error('E-mail ou senha inválidos');
  }

  const passwordIsValid = await bcrypt.compare(password, user.password);

  if (!passwordIsValid) {
    throw new Error('E-mail ou senha inválidos');
  }

  return user;
}

module.exports = {
  registerUser,
  loginUser,
};
