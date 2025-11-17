'use strict';

const { QueryTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const cards = [
      {
        title: 'Banheiro do quinto andar: quando a manutenção regulariza?',
        description:
          'O banheiro do quinto andar está quase sempre fechado e o único que fica aberto forma filas enormes entre as aulas. Existe um cronograma de manutenção? Podem informar horários e prazo para normalização?',
        author: 'João Silva',
        user_id: 'uid_joao_silva',
        up_down: 15,
        created_at: new Date('2024-01-15T10:30:00Z'),
        updated_at: now,
      },
      {
        title:
          'Cantina fechada há três dias: previsão de retorno e alternativas',
        description:
          'A cantina está fechada há três dias seguidos. Há previsão de reabertura? Existe alternativa temporária para compra de lanches e refeições nos intervalos?',
        author: 'Anônimo',
        user_id: 'uid_anon_1',
        up_down: 23,
        created_at: new Date('2024-01-14T15:45:00Z'),
        updated_at: now,
      },
      {
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
        title: 'Linhas de ônibus e horários próximos ao campus',
        description:
          'Os ônibus que atendem o campus têm atrasado nos horários de pico. A faculdade pode solicitar ajuste de horários ou reforço nas linhas?',
        author: 'Anônimo',
        user_id: 'uid_anon_2',
        up_down: 12,
        created_at: new Date('2024-01-11T11:30:00Z'),
        updated_at: now,
      },
      {
        title: 'Ar-condicionado das salas sempre desligado no período da tarde',
        description:
          'Nas salas do sexto andar, o ar-condicionado quase nunca é ligado à tarde, mesmo em dias muito quentes. Existe alguma regra de uso ou problema técnico? Poderiam informar se há previsão de ajuste?',
        author: 'Fernanda Costa',
        user_id: 'uid_fernanda_costa',
        up_down: 9,
        created_at: new Date('2024-01-10T16:10:00Z'),
        updated_at: now,
      },
      {
        title:
          'Biblioteca lotada em semana de prova: possibilidade de ampliar horário?',
        description:
          'Em semanas de prova, a biblioteca fica sem lugares disponíveis para estudo em grupo e individual. A instituição poderia estender o horário de funcionamento nesses períodos críticos?',
        author: 'Anônimo',
        user_id: 'uid_anon_3',
        up_down: 19,
        created_at: new Date('2024-01-09T18:40:00Z'),
        updated_at: now,
      },
      {
        title: 'Qualidade do Wi-Fi nos corredores e áreas de convivência',
        description:
          'O sinal de Wi-Fi é muito fraco nos corredores e áreas de convivência, o que dificulta acesso a materiais no AVA entre uma aula e outra. Há plano para ampliar a cobertura ou aumentar a capacidade da rede?',
        author: 'Lucas Pereira',
        user_id: 'uid_lucas_pereira',
        up_down: 14,
        created_at: new Date('2024-01-08T13:05:00Z'),
        updated_at: now,
      },
      {
        title: 'Divulgação de cancelamento de aula em cima da hora',
        description:
          'Algumas aulas são canceladas poucos minutos antes do horário, e muitos alunos já estão no campus. Existe algum canal oficial ou prazo mínimo para avisar cancelamentos, além dos grupos de mensagem?',
        author: 'Prof. Ana Ribeiro',
        user_id: 'uid_ana_ribeiro',
        up_down: 11,
        created_at: new Date('2024-01-07T07:50:00Z'),
        updated_at: now,
      },
      {
        title: 'Acessibilidade para alunos com mobilidade reduzida',
        description:
          'Algumas rampas e elevadores demoram para ser liberados ou ficam indisponíveis durante parte do dia. A faculdade poderia revisar a acessibilidade dos prédios e divulgar um canal para reporte rápido de problemas?',
        author: 'Anônimo',
        user_id: 'uid_anon_4',
        up_down: 21,
        created_at: new Date('2024-01-06T19:20:00Z'),
        updated_at: now,
      },
      {
        title: 'Banheiros do 4º andar frequentemente sem papel e sabão',
        description:
          'Os banheiros do 4º andar quase sempre estão sem papel higiênico e sabão líquido, principalmente no período noturno. Existe uma rotina de reposição específica para esse andar? Poderiam revisar a frequência de manutenção?',
        author: 'Carla Nogueira',
        user_id: 'uid_carla_nogueira',
        up_down: 8,
        created_at: new Date('2024-01-05T08:15:00Z'),
        updated_at: now,
      },
      {
        title: 'Salas de aula do 5º andar com projetores falhando',
        description:
          'Diversas aulas no 5º andar estão sendo prejudicadas porque os projetores desligam sozinhos ou não ligam de primeira. Há algum plano de revisão ou substituição desses equipamentos nesse andar?',
        author: 'Anônimo',
        user_id: 'uid_anon_5',
        up_down: 16,
        created_at: new Date('2024-01-04T17:25:00Z'),
        updated_at: now,
      },
      {
        title: 'Barulho excessivo no 6º andar durante as aulas',
        description:
          'O 6º andar costuma ficar muito barulhento no intervalo e até durante as aulas, por causa de pessoas conversando alto no corredor. A coordenação poderia avaliar alguma forma de orientação ou fiscalização para manter o silêncio próximo às salas?',
        author: 'Pedro Henrique',
        user_id: 'uid_pedro_henrique',
        up_down: 10,
        created_at: new Date('2024-01-03T20:10:00Z'),
        updated_at: now,
      },
      {
        title: 'Iluminação fraca nas salas do 7º andar',
        description:
          'As salas do 7º andar têm lâmpadas queimadas há semanas, o que dificulta a leitura de slides e anotações, principalmente no turno da noite. Existe previsão para troca dessas lâmpadas?',
        author: 'Anônimo',
        user_id: 'uid_anon_6',
        up_down: 13,
        created_at: new Date('2024-01-02T09:40:00Z'),
        updated_at: now,
      },
      {
        title: 'Falta de ventilação no 8º andar em dias quentes',
        description:
          'No 8º andar, mesmo com janelas abertas, as salas ficam muito quentes e abafadas. Há possibilidade de instalar ventiladores adicionais ou revisar o uso do ar-condicionado nesse andar?',
        author: 'Rafael Lima',
        user_id: 'uid_rafael_lima',
        up_down: 17,
        created_at: new Date('2024-01-01T12:05:00Z'),
        updated_at: now,
      },
      {
        title: 'Fila para elevadores nos horários de pico (4º ao 8º andar)',
        description:
          'Nos horários de troca de aula, as filas para os elevadores que atendem do 4º ao 8º andar estão enormes, fazendo muitos alunos chegarem atrasados. Existe algum plano para otimizar o fluxo, como escalonar horários ou priorizar alguns andares em determinados momentos?',
        author: 'Ana Paula',
        user_id: 'uid_ana_paula',
        up_down: 9,
        created_at: new Date('2024-01-10T18:20:00Z'),
        updated_at: now,
      },
      {
        title: 'Falta de tomadas nas salas do 4º andar',
        description:
          'As salas do 4º andar têm poucas tomadas próximas às carteiras, o que dificulta usar notebook durante as aulas. A faculdade poderia avaliar a instalação de mais pontos de energia nesse andar?',
        author: 'Anônimo',
        user_id: 'uid_anon_7',
        up_down: 11,
        created_at: new Date('2024-01-09T13:50:00Z'),
        updated_at: now,
      },
      {
        title: 'Ar-condicionado muito frio nas salas do 5º andar',
        description:
          'No 5º andar, o ar-condicionado frequentemente fica em temperatura muito baixa, deixando a sala desconfortável e alguns alunos até com dor de cabeça. Seria possível ajustar a temperatura padrão ou permitir que o professor controle melhor o equipamento?',
        author: 'Lucas Ferreira',
        user_id: 'uid_lucas_ferreira',
        up_down: 14,
        created_at: new Date('2024-01-08T19:05:00Z'),
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert('card', cards);
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
