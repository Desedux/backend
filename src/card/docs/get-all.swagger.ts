import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { CardModel } from '../card.model';

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
      type: CardModel,
      isArray: true,
    }),
  );
}
