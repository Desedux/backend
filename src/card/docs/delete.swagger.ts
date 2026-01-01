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
      schema: { example: 'This action deletes a card' },
    }),
    ApiForbiddenResponse({
      description: 'Usuário não é o autor do card.',
      schema: { example: { statusCode: 403, message: 'Forbidden' } },
    }),
    ApiNotFoundResponse({
      description: 'Card não encontrado.',
      schema: { example: { statusCode: 404, message: 'Card not found' } },
    }),
    ApiUnauthorizedResponse({
      description: 'Não autenticado.',
      schema: { example: { statusCode: 401, message: 'Unauthorized' } },
    }),
  );
}
