'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const comments = [
      {
        id: 1,
        card_id: 1,
        user_uid: 'uid_maria_santos',
        author: 'Maria Santos',
        content:
          'Seria ótimo publicar um cronograma de manutenção e sinalizar os banheiros disponíveis no app da faculdade. Isso ajudaria a evitar filas nas trocas de aula.',
        up_down: 5,
        parent_id: null,
        created_at: new Date('2024-01-15T11:00:00Z'),
        updated_at: now,
      },
      {
        id: 2,
        card_id: 1,
        user_uid: 'uid_gabinete_wyden',
        author: 'Coordenação do Campus',
        content:
          'Estamos finalizando um plano de manutenção com horários fixos entre turnos e placas informativas por bloco. Também reforçaremos a equipe de limpeza nas próximas semanas e publicaremos os banheiros operacionais por período.',
        up_down: 12,
        parent_id: null,
        created_at: new Date('2024-01-15T14:00:00Z'),
        updated_at: now,
      },
      {
        id: 3,
        card_id: 1,
        user_uid: 'uid_anon_3',
        author: 'Anônimo',
        content:
          'Enquanto isso, poderiam colocar dispensers de álcool em gel perto das salas? Ajuda quando o banheiro está lotado.',
        up_down: 8,
        parent_id: null,
        created_at: new Date('2024-01-15T12:00:00Z'),
        updated_at: now,
      },
      {
        id: 4,
        card_id: 1,
        user_uid: 'uid_pedro_lima',
        author: 'Pedro Lima',
        content:
          'Concordo com o cronograma no app. Também dava para abrir o banheiro do térreo do Bloco C nos intervalos para aliviar o fluxo.',
        up_down: 2,
        parent_id: 1,
        created_at: new Date('2024-01-15T11:30:00Z'),
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert('comment', comments);

    try {
      await queryInterface.sequelize.query(
        `SELECT setval(pg_get_serial_sequence('comment','id'), (SELECT GREATEST(MAX(id), 1) FROM "comment"));`
      );
    } catch {}
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comment', {
      id: { [Sequelize.Op.in]: [1, 2, 3, 4] },
    });
  },
};
