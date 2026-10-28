require('dotenv').config();

const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log('MySQL conectado com sucesso');

    app.listen(PORT, () => {
      console.log(`FinBank API rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:', error.message);
  }
}

startServer();
