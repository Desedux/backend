'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const cardTags = [
      { card_id: 1, tag_id: 3 },
      { card_id: 2, tag_id: 5 },
      { card_id: 3, tag_id: 1 },
      { card_id: 4, tag_id: 8 },
      { card_id: 5, tag_id: 4 },
      { card_id: 6, tag_id: 3 },
      { card_id: 7, tag_id: 2 },
      { card_id: 8, tag_id: 8 },
      { card_id: 9, tag_id: 2 },
      { card_id: 10, tag_id: 3 },
      { card_id: 11, tag_id: 3 },
      { card_id: 12, tag_id: 8 },
      { card_id: 13, tag_id: 2 },
      { card_id: 14, tag_id: 2 },
      { card_id: 15, tag_id: 3 },
      { card_id: 16, tag_id: 4 },
      { card_id: 17, tag_id: 8 },
      { card_id: 18, tag_id: 3 },
    ];

    await queryInterface.bulkInsert('card_tags', cardTags);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('card_tags', null, {});
  },
};
