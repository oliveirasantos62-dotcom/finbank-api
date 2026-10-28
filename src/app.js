const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');

const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const bankingRoutes = require('./routes/bankingRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');

const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'FinBank API funcionando',
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/accounts', accountRoutes);
app.use('/accounts', bankingRoutes);
app.use('/transactions', transactionRoutes);

app.use(errorMiddleware);

module.exports = app;
