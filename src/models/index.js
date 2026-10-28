const User = require('./User');
const Account = require('./Account');
const Transaction = require('./Transaction');

User.hasMany(Account, {
  foreignKey: 'userId',
  as: 'accounts',
});

Account.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Account.hasMany(Transaction, {
  foreignKey: 'accountId',
  as: 'transactions',
});

Transaction.belongsTo(Account, {
  foreignKey: 'accountId',
  as: 'account',
});

module.exports = {
  User,
  Account,
  Transaction,
};
