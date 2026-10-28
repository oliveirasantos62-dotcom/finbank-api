const path = require('path');
const { Sequelize } = require('sequelize');

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

require('dotenv').config({
  path: path.resolve(process.cwd(), envFile),
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  },
);

module.exports = sequelize;
