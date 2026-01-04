import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';

export function SwaggerListAllCards() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar cards paginados' }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Número da página (20 itens por página)',
    }),
    ApiOkResponse({
      description: 'Lista retornada com sucesso.',
      example: [
        {
          id: 2,
          title:
            'Cantina fechada há três dias: previsão de retorno e alternativas',
          description:
            'A cantina está fechada há três dias seguidos. Há previsão de reabertura? Existe alternativa temporária para compra de lanches e refeições nos intervalos?',
          author: 'Anônimo',
          up_down: 23,
          user_id: 'uid_anon_1',
          deactivated: false,
          created_at: '2024-01-14T15:45:00.000Z',
          updated_at: '2025-11-17T11:58:49.905Z',
          user_vote: 0,
        },
        {
          id: 10,
          title: 'Acessibilidade para alunos com mobilidade reduzida',
          description:
            'Algumas rampas e elevadores demoram para ser liberados ou ficam indisponíveis durante parte do dia. A faculdade poderia revisar a acessibilidade dos prédios e divulgar um canal para reporte rápido de problemas?',
          author: 'Anônimo',
          up_down: 21,
          user_id: 'uid_anon_4',
          deactivated: false,
          created_at: '2024-01-06T19:20:00.000Z',
          updated_at: '2025-11-17T11:58:49.905Z',
          user_vote: 0,
        },
      ],
      isArray: true,
    }),
  );
}
