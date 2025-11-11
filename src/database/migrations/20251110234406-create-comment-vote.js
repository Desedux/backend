'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comment_vote', {
      comment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'comment',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      },
      vote: {
        type: Sequelize.SMALLINT,
        allowNull: false,
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

    await queryInterface.addConstraint('comment_vote', {
      fields: ['comment_id', 'user_id'],
      type: 'primary key',
      name: 'comment_vote_pk',
    });

    await queryInterface.addIndex('comment_vote', ['comment_id'], {
      name: 'comment_vote_comment_id_idx',
    });

    await queryInterface.addIndex('comment_vote', ['user_id'], {
      name: 'comment_vote_user_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('comment_vote');
  },
};
