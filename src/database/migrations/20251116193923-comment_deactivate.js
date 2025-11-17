'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('comment', 'deactivate', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indica se o comentário foi desativado pelo autor',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('comment', 'deactivate');
  },
};
