'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      uid: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        comment: 'UID do usuário no Firebase',
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Função do usuário (ex: admin, user, moderator)',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  },
};
