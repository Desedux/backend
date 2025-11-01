'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comment', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'Identificador único do comentário (chave primária)',
      },
      card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'ID do card ao qual este comentário pertence',
      },
      user_uid: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'UID do autor no Firebase Auth',
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Nome exibido do autor no momento da publicação',
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Texto/conteúdo do comentário',
      },
      up_down: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Pontuação acumulada (likes - dislikes) do comentário',
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment:
          'ID do comentário pai (thread). Null para comentários de nível raiz',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        comment: 'Data e hora de criação do comentário',
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        comment: 'Data e hora da última edição do comentário',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('comment');
  },
};
