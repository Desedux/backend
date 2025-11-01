// 20251101-create-comment-reaction.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comment_reaction', {
      comment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'comment', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'ID do comentário alvo da reação (FK → comment.id)',
      },
      user_uid: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'UID do usuário (Firebase) que reagiu ao comentário',
      },
      action: {
        type: Sequelize.ENUM('like', 'dislike'),
        allowNull: true,
        comment:
          'Tipo de reação do usuário: like = +1, dislike = -1; null significa reação removida (none)',
      },
    });

    await queryInterface.addConstraint('comment_reaction', {
      fields: ['comment_id', 'user_uid'],
      type: 'primary key',
      name: 'comment_reaction_pk',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('comment_reaction');
  },
};
