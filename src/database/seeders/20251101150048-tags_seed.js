'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //todo: alterar tags Ryan ficou responsavel
    await queryInterface.bulkInsert('tag', [
      {
        name: 'Segurança',
        image_url: 'https://example.com/images/security.png',
        description: 'Discussões sobre segurança pública, policiamento e prevenção à criminalidade',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Educação',
        image_url: 'https://example.com/images/education.png',
        description: 'Tópicos sobre ensino, infraestrutura escolar e formação de professores',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Saúde',
        image_url: 'https://example.com/images/health.png',
        description: 'Questões relacionadas à saúde pública, hospitais e programas preventivos',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Transporte',
        image_url: 'https://example.com/images/transport.png',
        description: 'Melhorias no transporte público, infraestrutura viária e mobilidade urbana',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Economia',
        image_url: 'https://example.com/images/economy.png',
        description: 'Desenvolvimento econômico, incentivos fiscais e apoio a empresas',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Meio Ambiente',
        image_url: 'https://example.com/images/environment.png',
        description: 'Sustentabilidade, preservação ambiental e políticas ecológicas',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Cultura',
        image_url: 'https://example.com/images/culture.png',
        description: 'Eventos culturais, patrimônio histórico e incentivo às artes',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Tecnologia',
        image_url: 'https://example.com/images/technology.png',
        description: 'Inovação, transformação digital e inclusão tecnológica',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tag', null, {});
  },
};
