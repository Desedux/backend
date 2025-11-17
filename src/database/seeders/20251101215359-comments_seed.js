'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const comments = [
      {
        card_id: 1,
        user_uid: 'uid_maria_santos',
        author: 'Maria Santos',
        content:
          'Seria ótimo publicar um cronograma de manutenção e sinalizar os banheiros disponíveis no app da faculdade. Isso ajudaria a evitar filas nas trocas de aula.',
        up_down: 5,
        parent_id: null,
        created_at: '2024-01-15T11:00:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 1,
        user_uid: 'uid_gabinete_wyden',
        author: 'Coordenação do Campus',
        content:
          'Estamos finalizando um plano de manutenção com horários fixos entre turnos e placas informativas por bloco. Também reforçaremos a equipe de limpeza nas próximas semanas e publicaremos os banheiros operacionais por período.',
        up_down: 12,
        parent_id: null,
        created_at: '2024-01-15T14:00:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 1,
        user_uid: 'uid_anon_3',
        author: 'Kaique Luz',
        content:
          'Enquanto isso, poderiam colocar dispensers de álcool em gel perto das salas? Ajuda quando o banheiro está lotado.',
        up_down: 8,
        parent_id: null,
        created_at: '2024-01-15T12:00:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 1,
        user_uid: 'uid_pedro_lima',
        author: 'Pedro Lima',
        content:
          'Concordo com o cronograma no app. Também dava para abrir o banheiro do térreo do Bloco C nos intervalos para aliviar o fluxo.',
        up_down: 2,
        parent_id: 1,
        created_at: '2024-01-15T11:30:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 1,
        user_uid: 'uid_maria_santos',
        author: 'Maria Santos',
        content:
          'A situação no banheiro do quinto andar está bem complicada mesmo. Às vezes a fila se estende até o corredor. Um cronograma fixo de manutenção ajudaria bastante.',
        up_down: 6,
        parent_id: null,
        created_at: '2024-01-15T11:00:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 1,
        user_uid: 'uid_gabinete_wyden',
        author: 'Coordenação do Campus',
        content:
          'Estamos revisando o cronograma de manutenção dos banheiros do quinto andar. A ideia é publicar, no site e nos murais, os horários de limpeza e os banheiros disponíveis por turno.',
        up_down: 12,
        parent_id: null,
        created_at: '2024-01-15T14:00:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 1,
        user_uid: 'uid_anon_3',
        author: 'Sabrina Moraes',
        content:
          'Enquanto isso, seria interessante deixar avisos nas portas indicando qual banheiro está funcionando para evitar que a gente fique tentando vários andares à toa.',
        up_down: 4,
        parent_id: 1,
        created_at: '2024-01-15T14:30:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 2,
        user_uid: 'uid_lucas_pereira',
        author: 'Lucas Pereira',
        content:
          'A cantina fechada tem atrapalhado bastante quem não consegue sair do campus no intervalo. Pelo menos uma opção temporária de lanches rápidos já ajudaria.',
        up_down: 10,
        parent_id: null,
        created_at: '2024-01-14T16:10:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 2,
        user_uid: 'uid_gabinete_wyden',
        author: 'Coordenação do Campus',
        content:
          'A cantina está passando por uma adequação sanitária. A previsão de reabertura é em até 7 dias. Enquanto isso, estamos negociando um ponto de venda provisório no hall de entrada.',
        up_down: 15,
        parent_id: null,
        created_at: '2024-01-14T17:00:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 2,
        user_uid: 'uid_anon_4',
        author: 'Jéssica Monteiro',
        content:
          'Seria legal avisar por e-mail ou app quando a cantina voltar a funcionar, porque muita gente nem sabe o motivo do fechamento.',
        up_down: 3,
        parent_id: 5,
        created_at: '2024-01-14T17:30:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 3,
        user_uid: 'uid_pedro_henrique',
        author: 'Pedro Henrique',
        content:
          'Quem sai mais tarde sente muita insegurança no estacionamento. A iluminação realmente é fraca em alguns pontos e quase não vemos vigilância circulando.',
        up_down: 9,
        parent_id: null,
        created_at: '2024-01-13T20:00:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 3,
        user_uid: 'uid_gabinete_wyden',
        author: 'Equipe de Segurança',
        content:
          'Estamos mapeando os trechos mais escuros do estacionamento para substituição de lâmpadas e instalação de novos postes de luz. Também será reforçada a ronda no horário das 21h às 23h.',
        up_down: 13,
        parent_id: null,
        created_at: '2024-01-13T21:00:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 3,
        user_uid: 'uid_anon_5',
        author: 'Leonardo Carvalho',
        content:
          'Uma sugestão é colocar um botão de “pedir acompanhamento” no app, para quem quiser sair acompanhado até o ponto ou estacionamento.',
        up_down: 4,
        parent_id: 8,
        created_at: '2024-01-13T21:20:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 4,
        user_uid: 'uid_carlos_mendes',
        author: 'Dr. Carlos Mendes',
        content:
          'Tenho notado que muitos alunos não conseguem usar o laboratório no noturno por falta de máquina disponível. Isso impacta diretamente os projetos das disciplinas.',
        up_down: 7,
        parent_id: null,
        created_at: '2024-01-12T19:00:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 4,
        user_uid: 'uid_gabinete_wyden',
        author: 'Coordenação Acadêmica',
        content:
          'Estamos avaliando a abertura de um novo horário de laboratório após as 22h e o remanejamento de algumas turmas para melhor distribuir a lotação ao longo da semana.',
        up_down: 10,
        parent_id: null,
        created_at: '2024-01-12T19:40:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 4,
        user_uid: 'uid_anon_6',
        author: 'Bianca Nascimento',
        content:
          'Talvez um sistema de agendamento rápido ajude a organizar quem precisa realmente do laboratório em determinado dia.',
        up_down: 3,
        parent_id: 11,
        created_at: '2024-01-12T20:05:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 5,
        user_uid: 'uid_joao_silva',
        author: 'João Silva',
        content:
          'Os atrasos dos ônibus têm feito muita gente chegar depois do início da aula, principalmente no primeiro horário da noite.',
        up_down: 8,
        parent_id: null,
        created_at: '2024-01-11T18:10:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 5,
        user_uid: 'uid_gabinete_wyden',
        author: 'Coordenação do Campus',
        content:
          'Já entramos em contato com a empresa responsável pelas linhas que atendem o campus, solicitando reforço nos horários de pico e ajustes nas saídas próximas às 18h e 22h.',
        up_down: 11,
        parent_id: null,
        created_at: '2024-01-11T19:00:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 5,
        user_uid: 'uid_anon_7',
        author: 'Paula Moretti',
        content:
          'Seria interessante divulgar uma tabela com os horários recomendados dos ônibus no site ou nos murais, pra gente conseguir se programar melhor.',
        up_down: 5,
        parent_id: 14,
        created_at: '2024-01-11T19:20:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 6,
        user_uid: 'uid_anon_9',
        author: 'Yasmin Camargo',
        content:
          'No sexto andar, às vezes o ar fica tão quente que a gente precisa sair da sala no meio da aula. Pelo menos poderiam alinhar melhor os horários em que o ar-condicionado fica ligado.',
        up_down: 7,
        parent_id: null,
        created_at: '2024-01-10T16:40:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 6,
        user_uid: 'uid_gabinete_wyden',
        author: 'Coordenação de Infraestrutura',
        content:
          'Identificamos falhas em alguns equipamentos do sexto andar e já solicitamos manutenção. Também estamos revisando o agendamento automático para que o ar-condicionado fique ligado durante todo o período de aula.',
        up_down: 11,
        parent_id: null,
        created_at: '2024-01-10T17:15:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 6,
        user_uid: 'uid_fernanda_costa',
        author: 'Fernanda Costa',
        content:
          'Obrigada pelo retorno. Seria ótimo se colocassem um aviso nas salas enquanto os ajustes não forem concluídos, para a gente saber que o problema já está sendo tratado.',
        up_down: 4,
        parent_id: 17,
        created_at: '2024-01-10T17:40:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 7,
        user_uid: 'uid_rafael_lima',
        author: 'Rafael Lima',
        content:
          'Na semana de provas, é praticamente impossível achar mesa na biblioteca depois das 19h. Muitos grupos acabam estudando no corredor, o que não é ideal.',
        up_down: 8,
        parent_id: null,
        created_at: '2024-01-09T19:10:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 7,
        user_uid: 'uid_gabinete_wyden',
        author: 'Biblioteca Central',
        content:
          'Estamos planejando estender o horário da biblioteca até 23h durante semanas de prova e reservar algumas mesas exclusivamente para estudo silencioso individual.',
        up_down: 13,
        parent_id: null,
        created_at: '2024-01-09T19:45:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 7,
        user_uid: 'uid_anon_10',
        author: 'Quezia Silveira',
        content:
          'Uma ideia seria permitir reserva de mesas por períodos de 1 ou 2 horas, para evitar que fiquem ocupadas o dia inteiro com materiais de quem não está lá.',
        up_down: 5,
        parent_id: 20,
        created_at: '2024-01-09T20:05:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 8,
        user_uid: 'uid_lucas_pereira',
        author: 'Lucas Pereira',
        content:
          'O Wi-Fi cai direto nos corredores do prédio, principalmente perto do elevador. Fica difícil baixar material ou revisar slides entre uma aula e outra.',
        up_down: 9,
        parent_id: null,
        created_at: '2024-01-08T13:30:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 8,
        user_uid: 'uid_gabinete_wyden',
        author: 'Equipe de TI',
        content:
          'Estamos ampliando a quantidade de access points nos corredores e áreas de convivência. A previsão é de melhorar a cobertura de rede até o final do próximo mês.',
        up_down: 12,
        parent_id: null,
        created_at: '2024-01-08T14:00:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 8,
        user_uid: 'uid_anon_11',
        author: 'Sara Lopes',
        content:
          'Seria legal também divulgar um mapa dos pontos de melhor sinal, pelo menos enquanto a expansão não fica pronta.',
        up_down: 3,
        parent_id: 23,
        created_at: '2024-01-08T14:20:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 9,
        user_uid: 'uid_joao_silva',
        author: 'João Silva',
        content:
          'Já perdi duas aulas porque o cancelamento foi avisado só no grupo de WhatsApp da turma, e quem não estava online no momento acabou vindo à toa.',
        up_down: 10,
        parent_id: null,
        created_at: '2024-01-07T08:20:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 9,
        user_uid: 'uid_ana_ribeiro',
        author: 'Prof. Ana Ribeiro',
        content:
          'Estamos alinhando com a coordenação para que cancelamentos sejam registrados também no sistema acadêmico e, quando possível, comunicados por e-mail institucional.',
        up_down: 9,
        parent_id: null,
        created_at: '2024-01-07T09:00:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 9,
        user_uid: 'uid_anon_12',
        author: 'Larissa Silveira',
        content:
          'Um push no app da faculdade avisando o cancelamento ajudaria muito, principalmente para quem depende de transporte público.',
        up_down: 6,
        parent_id: 26,
        created_at: '2024-01-07T09:25:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 10,
        user_uid: 'uid_carla_nogueira',
        author: 'Carla Nogueira',
        content:
          'Meu colega usa muletas e já ficou preso esperando elevador funcionar no prédio principal. A acessibilidade precisa ser tratada com prioridade.',
        up_down: 14,
        parent_id: null,
        created_at: '2024-01-06T19:45:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 10,
        user_uid: 'uid_gabinete_wyden',
        author: 'Núcleo de Acessibilidade',
        content:
          'Estamos realizando um levantamento completo dos pontos de acesso para pessoas com mobilidade reduzida. Problemas com elevadores e rampas podem ser reportados diretamente pelo e-mail institucional do Núcleo de Acessibilidade, que será divulgado nos murais.',
        up_down: 16,
        parent_id: null,
        created_at: '2024-01-06T20:15:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 10,
        user_uid: 'uid_anon_13',
        author: 'Marcos Duarte',
        content:
          'Sugiro também treinamento específico para funcionários sobre como auxiliar alunos com mobilidade reduzida em situações de emergência.',
        up_down: 7,
        parent_id: 29,
        created_at: '2024-01-06T20:40:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 11,
        user_uid: 'uid_joao_silva',
        author: 'João Silva',
        content:
          'No 4º andar, quase sempre precisamos descer outro lance de escada só para conseguir lavar as mãos direito. Falta sabão e papel em vários horários, principalmente à noite.',
        up_down: 6,
        parent_id: null,
        created_at: '2024-01-05T08:30:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 11,
        user_uid: 'uid_limpeza_campus',
        author: 'Equipe de Limpeza',
        content:
          'Estamos revisando a escala de reposição de materiais no 4º andar, especialmente no turno da noite. Já incluímos checagens extras nos intervalos mais cheios para evitar falta de papel e sabão.',
        up_down: 10,
        parent_id: null,
        created_at: '2024-01-05T09:10:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 11,
        user_uid: 'uid_anon_14',
        author: 'Otávio Rezende',
        content:
          'Seria interessante colocar um aviso com o contato da limpeza perto do banheiro, para podermos reportar quando o material acabar.',
        up_down: 4,
        parent_id: 32,
        created_at: '2024-01-05T09:35:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 12,
        user_uid: 'uid_maria_santos',
        author: 'Maria Santos',
        content:
          'Já tivemos que improvisar aula só com explicação oral porque o projetor do 5º andar desligava toda hora. Isso atrapalha muito em disciplinas com muitos gráficos e códigos.',
        up_down: 9,
        parent_id: null,
        created_at: '2024-01-04T17:40:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 12,
        user_uid: 'uid_ti_campus',
        author: 'Suporte de TI',
        content:
          'Alguns projetores do 5º andar já foram identificados com falha e estão em processo de substituição. Enquanto isso, orientamos que os professores abram chamado pelo sistema sempre que o problema ocorrer.',
        up_down: 12,
        parent_id: null,
        created_at: '2024-01-04T18:05:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 12,
        user_uid: 'uid_anon_15',
        author: 'Mateus Henriques',
        content:
          'Se possível, avisem com antecedência quais salas estarão em manutenção para o professor já planejar outra sala ou recurso alternativo.',
        up_down: 5,
        parent_id: 35,
        created_at: '2024-01-04T18:25:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 13,
        user_uid: 'uid_pedro_henrique',
        author: 'Pedro Henrique',
        content:
          'No 6º andar é difícil ouvir o professor quando o corredor enche de gente conversando alto. Às vezes a porta fechada não resolve.',
        up_down: 8,
        parent_id: null,
        created_at: '2024-01-03T20:25:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 13,
        user_uid: 'uid_coordenacao_geral',
        author: 'Coordenação Geral',
        content:
          'Vamos reforçar, em sala e nos canais oficiais, orientações sobre silêncio nos corredores durante as aulas. Também avaliaremos a presença de monitores em horários mais críticos no 6º andar.',
        up_down: 11,
        parent_id: null,
        created_at: '2024-01-03T20:55:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 13,
        user_uid: 'uid_anon_16',
        author: 'Nicole Moreira',
        content:
          'Talvez marcar alguns espaços específicos para conversa e descanso ajude a tirar o fluxo de gente da porta das salas.',
        up_down: 3,
        parent_id: 38,
        created_at: '2024-01-03T21:15:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 14,
        user_uid: 'uid_bruna_oliveira',
        author: 'Bruna Oliveira',
        content:
          'No 7º andar, em algumas salas só metade das lâmpadas funciona. À noite fica bem cansativo para ler ou copiar conteúdo do quadro.',
        up_down: 7,
        parent_id: null,
        created_at: '2024-01-02T10:00:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 14,
        user_uid: 'uid_manutencao_campus',
        author: 'Setor de Manutenção',
        content:
          'Já registramos a troca das lâmpadas queimadas no 7º andar e estamos priorizando salas com aulas noturnas. A previsão é concluir esse reparo ainda nesta semana.',
        up_down: 10,
        parent_id: null,
        created_at: '2024-01-02T10:35:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 14,
        user_uid: 'uid_anon_17',
        author: 'Rafael Monteiro',
        content:
          'Seria legal se houvesse um canal rápido (como QR Code na sala) para reportar lâmpadas queimadas e outros problemas simples.',
        up_down: 4,
        parent_id: 41,
        created_at: '2024-01-02T10:55:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 15,
        user_uid: 'uid_rafael_lima',
        author: 'Rafael Lima',
        content:
          'O 8º andar fica bem abafado em dias quentes, principalmente nas últimas aulas da noite. A concentração cai demais.',
        up_down: 9,
        parent_id: null,
        created_at: '2024-01-01T12:20:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 15,
        user_uid: 'uid_infra_climatizacao',
        author: 'Equipe de Infraestrutura',
        content:
          'Estamos avaliando ajustes no sistema de climatização do 8º andar e a instalação de ventiladores adicionais em algumas salas mais críticas.',
        up_down: 13,
        parent_id: null,
        created_at: '2024-01-01T12:50:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
      {
        card_id: 15,
        user_uid: 'uid_anon_18',
        author: 'João Amaral',
        content:
          'Enquanto isso, poderia haver orientação para abrir as salas alguns minutos antes da aula para ventilar melhor o ambiente.',
        up_down: 5,
        parent_id: 44,
        created_at: '2024-01-01T13:05:00.000Z',
        updated_at: '2025-11-17T00:07:48.696Z',
      },
    ];

    await queryInterface.bulkInsert('comment', comments);

    try {
      await queryInterface.sequelize.query(
        `SELECT setval(pg_get_serial_sequence('comment','id'), (SELECT GREATEST(MAX(id), 1) FROM "comment"));`,
      );
    } catch {}
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('comment', {
      id: { [Sequelize.Op.in]: [1, 2, 3, 4] },
    });
  },
};
