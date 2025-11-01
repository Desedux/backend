'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('card_tags', {
      card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'card',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tag',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.addConstraint('card_tags', {
      fields: ['card_id', 'tag_id'],
      type: 'primary key',
      name: 'card_tags_pkey',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('card_tags');
  },
};
