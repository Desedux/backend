import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export function SwaggerDetailCard() {
  return applyDecorators(
    ApiOperation({ summary: 'Obter um card pelo ID' }),
    ApiParam({
      name: 'id',
      type: String,
      example: '1',
      description: 'ID do card',
    }),
    ApiOkResponse({
      description: 'Card encontrado.',
      example: {
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
    }),
    ApiNotFoundResponse({
      description: 'Card não encontrado.',
      schema: {
        example: { statusCode: 404, message: 'Card not found' },
      },
    }),
  );
}
