import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { CardModel } from '../card.model';

export function SwaggerGetByCategory() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar cards por categoria paginados' }),
    ApiParam({
      name: 'category',
      type: Number,
      example: 1,
      description: 'Categoria (tag) do card',
    }),
    ApiParam({
      name: 'page',
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
