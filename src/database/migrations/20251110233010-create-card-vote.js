'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('card_vote', {
      card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'card',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'ID do card votado (FK → card.id)',
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'user',
          key: 'uid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'UID do usuário (Firebase) que votou (FK → user.uid)',
      },
      vote: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        comment: '1 = like, -1 = dislike',
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

    await queryInterface.addConstraint('card_vote', {
      fields: ['card_id', 'user_id'],
      type: 'primary key',
      name: 'card_vote_pk',
    });

    await queryInterface.addIndex('card_vote', ['card_id'], {
      name: 'card_vote_card_id_idx',
    });

    await queryInterface.addIndex('card_vote', ['user_id'], {
      name: 'card_vote_user_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('card_vote');
  },
};
