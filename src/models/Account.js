const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Account = sequelize.define(
  'Account',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    type: {
      type: DataTypes.ENUM('checking', 'savings'),
      allowNull: false,
      defaultValue: 'checking',
    },

    balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
  },
  {
    tableName: 'accounts',
    timestamps: true,
  },
);

module.exports = Account;
