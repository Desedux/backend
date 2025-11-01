'use strict';

const { QueryTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const cards = [
      {
        id: 1,
        title: 'Banheiro do Bloco B: quando a manutenção regulariza?',
        description:
          'O banheiro do Bloco B está quase sempre fechado e o único que fica aberto forma filas enormes entre as aulas. Existe um cronograma de manutenção? Podem informar horários e prazo para normalização?',
        author: 'João Silva',
        user_id: 'uid_joao_silva',
        up_down: 15,
        created_at: new Date('2024-01-15T10:30:00Z'),
        updated_at: now,
      },
      {
        id: 2,
        title: 'Cantina fechada há três dias: previsão de retorno e alternativas',
        description:
          'A cantina está fechada há três dias seguidos. Há previsão de reabertura? Existe alternativa temporária para compra de lanches e refeições nos intervalos?',
        author: 'Anônimo',
        user_id: 'uid_anon_1',
        up_down: 23,
        created_at: new Date('2024-01-14T15:45:00Z'),
        updated_at: now,
      },
      {
        id: 3,
        title: 'Segurança no campus à noite e iluminação no estacionamento',
        description:
          'Quem sai das aulas à noite tem relatado áreas escuras no estacionamento e pouca ronda. Há plano para reforço da segurança e melhoria da iluminação?',
        author: 'Maria Santos',
        user_id: 'uid_maria_santos',
        up_down: 7,
        created_at: new Date('2024-01-13T09:20:00Z'),
        updated_at: now,
      },
      {
        id: 4,
        title: 'Laboratórios lotados no noturno: mais máquinas ou horários?',
        description:
          'Os laboratórios de informática ficam lotados no período noturno. É possível ampliar o número de máquinas ou abrir novos horários para prática?',
        author: 'Dr. Carlos Mendes',
        user_id: 'uid_carlos_mendes',
        up_down: 18,
        created_at: new Date('2024-01-12T14:15:00Z'),
        updated_at: now,
      },
      {
        id: 5,
        title: 'Linhas de ônibus e horários próximos ao campus',
        description:
          'Os ônibus que atendem o campus têm atrasado nos horários de pico. A faculdade pode solicitar ajuste de horários ou reforço nas linhas?',
        author: 'Anônimo',
        user_id: 'uid_anon_2',
        up_down: 12,
        created_at: new Date('2024-01-11T11:30:00Z'),
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert('card', cards);

    const allTags = await queryInterface.sequelize.query(
      `SELECT id, name FROM "tag";`,
      { type: QueryTypes.SELECT }
    );

    const byName = {};
    for (const t of allTags) {
      byName[(t.name || '').toLowerCase()] = t.id;
    }

    const desired = [
      { cardId: 1, tagNames: ['Saúde', 'Educação'] },
      { cardId: 2, tagNames: ['Economia', 'Saúde'] },
      { cardId: 3, tagNames: ['Segurança', 'Transporte'] },
      { cardId: 4, tagNames: ['Tecnologia', 'Educação'] },
      { cardId: 5, tagNames: ['Transporte', 'Economia'] },
    ];

    const cardTags = [];
    for (const d of desired) {
      for (const name of d.tagNames) {
        const tagId = byName[name.toLowerCase()];
        if (tagId) {
          cardTags.push({
            card_id: d.cardId,
            tag_id: tagId,
          });
        }
      }
    }

    if (cardTags.length) {
      await queryInterface.bulkInsert('card_tags', cardTags);
    }

    try {
      await queryInterface.sequelize.query(
        `SELECT setval(pg_get_serial_sequence('card','id'), (SELECT GREATEST(MAX(id), 1) FROM "card"));`
      );
    } catch {}
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('card_tags', {
      card_id: { [Sequelize.Op.in]: [1, 2, 3, 4, 5] },
    });

    await queryInterface.bulkDelete('comment', {
      card_id: { [Sequelize.Op.in]: [1, 2, 3, 4, 5] },
    });

    await queryInterface.bulkDelete('card', {
      id: { [Sequelize.Op.in]: [1, 2, 3, 4, 5] },
    });
  },
};
