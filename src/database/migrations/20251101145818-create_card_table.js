'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('card', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'Identificador único do card (chave primária)',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Título do card — deve resumir o assunto principal',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Descrição completa do conteúdo do card (texto principal)',
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Nome do autor do card — pode ser anônimo ou o nome do usuário',
      },
      up_down: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Pontuação do card — soma de votos positivos e negativos',
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'UID do usuário no Firebase que criou o card',
      },
      deactivated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indica se o card está desativado (true) ou ativo (false)',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        comment: 'Data e hora em que o card foi criado',
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        comment: 'Data e hora da última atualização do card',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('card');
  },
};
