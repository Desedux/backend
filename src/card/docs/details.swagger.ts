import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CardModel } from '../card.model';

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
      type: CardModel,
    }),
    ApiNotFoundResponse({
      description: 'Card não encontrado.',
      schema: {
        example: { statusCode: 404, message: 'Card not found' },
      },
    }),
  );
}
