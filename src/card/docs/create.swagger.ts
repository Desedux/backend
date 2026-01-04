import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  getSchemaPath,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth/auth.guard';
import { CreateCardDto } from '../dto/request/createCard';

export function SwaggerCreateCard() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiOperation({ summary: 'Criar um novo card' }),
    ApiBody({
      schema: {
        allOf: [{ $ref: getSchemaPath(CreateCardDto) }],
        example: {
          title: 'Sugestão de melhoria',
          description: 'Adicionar modo offline no app',
          isAnonymous: false,
          tags: [1, 2],
        },
      },
    }),
    ApiCreatedResponse({
      description: 'Card criado com sucesso.',
      schema: {
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
      },
    }),
    ApiBadRequestResponse({
      description: 'Tags inválidas/ausentes.',
      schema: { example: { statusCode: 400, message: 'Tags not found' } },
    }),
    ApiNotFoundResponse({
      description: 'Usuário não encontrado.',
      schema: { example: { statusCode: 404, message: 'User not found' } },
    }),
    ApiForbiddenResponse({
      description: 'Não autenticado.',
      schema: {
        example: {
          message: 'Forbidden resource',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    }),
  );
}
