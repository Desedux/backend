import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
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
      schema: { example: 'This action adds a new card' },
    }),
    ApiBadRequestResponse({
      description: 'Tags inválidas/ausentes.',
      schema: { example: { statusCode: 400, message: 'Tags not found' } },
    }),
    ApiNotFoundResponse({
      description: 'Usuário não encontrado.',
      schema: { example: { statusCode: 404, message: 'User not found' } },
    }),
    ApiUnauthorizedResponse({
      description: 'Não autenticado.',
      schema: { example: { statusCode: 401, message: 'Unauthorized' } },
    }),
  );
}
