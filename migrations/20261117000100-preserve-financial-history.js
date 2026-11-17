module.exports = {
  async up(queryInterface) {
    const accountConstraints = await queryInterface.getForeignKeyReferencesForTable('accounts');
    for (const constraint of accountConstraints.filter((item) => item.referencedTableName === 'users')) {
      await queryInterface.removeConstraint('accounts', (constraint.constraintName || constraint.constraint_name || constraint.name));
    }
    await queryInterface.addConstraint('accounts', {
      fields: ['userId'], type: 'foreign key', name: 'fk_accounts_users_restrict',
      references: { table: 'users', field: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT',
    });

    const transactionConstraints = await queryInterface.getForeignKeyReferencesForTable('transactions');
    for (const constraint of transactionConstraints.filter((item) => item.referencedTableName === 'accounts')) {
      await queryInterface.removeConstraint('transactions', (constraint.constraintName || constraint.constraint_name || constraint.name));
    }
    await queryInterface.addConstraint('transactions', {
      fields: ['accountId'], type: 'foreign key', name: 'fk_transactions_accounts_restrict',
      references: { table: 'accounts', field: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('transactions', 'fk_transactions_accounts_restrict');
    await queryInterface.addConstraint('transactions', {
      fields: ['accountId'], type: 'foreign key', name: 'fk_transactions_accounts_cascade',
      references: { table: 'accounts', field: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
    });
    await queryInterface.removeConstraint('accounts', 'fk_accounts_users_restrict');
    await queryInterface.addConstraint('accounts', {
      fields: ['userId'], type: 'foreign key', name: 'fk_accounts_users_cascade',
      references: { table: 'users', field: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
    });
  },
};
