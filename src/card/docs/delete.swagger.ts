import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth/auth.guard';

export function SwaggerDeleteCard() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Excluir (desativar) um card' }),
    ApiParam({
      name: 'id',
      type: String,
      example: '1',
      description: 'ID do card',
    }),
    ApiOkResponse({
      description: 'Card excluído (soft delete).',
      schema: { example: {} },
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
    ApiNotFoundResponse({
      description: 'Card não encontrado.',
      schema: { example: { statusCode: 404, message: 'Card not found' } },
    }),
    ApiUnauthorizedResponse({
      description: 'Não é o dono do card.',
      schema: {
        example: {
          statusCode: 401,
          message: 'You are not allowed to do this action.',
        },
      },
    }),
  );
}
