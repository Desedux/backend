'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tag', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(80),
        allowNull: false,
        unique: true,
        comment: 'Nome da tag',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Descrição da tag',
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL da imagem representativa da tag',
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
    await queryInterface.dropTable('tag');
  },
};
