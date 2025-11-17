'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'user',
      [
        {
          uid: 'ZsawwSmrRlf9EMI2WorSIQOcbuy2',
          role: 'student',
          created_at: new Date('2025-11-13T21:54:23.847905Z'),
          updated_at: new Date('2025-11-13T21:54:23.847905Z'),
        },
        {
          uid: 'hh90v054xJVHlmIEIfUSwUYenOD2',
          role: 'student',
          created_at: new Date('2025-11-13T21:54:23.847905Z'),
          updated_at: new Date('2025-11-13T21:54:23.847905Z'),
        },
        {
          uid: 'tHd5V39csba3MPHun5i8WSv6hDG2',
          role: 'student',
          created_at: new Date('2025-11-13T21:54:23.847905Z'),
          updated_at: new Date('2025-11-13T21:54:23.847905Z'),
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'user',
      { uid: 'ZsawwSmrRlf9EMI2WorSIQOcbuy2' },
      {}
    );
  }
};
