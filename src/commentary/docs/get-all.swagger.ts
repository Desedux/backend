import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PaginatedCommentsResponse } from '../dto/response/PaginatedCommentsResponse';

export function SwaggerListCommentary() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar comentários de um card (raiz ou respostas)',
    }),
    ApiParam({
      name: 'cardId',
      type: Number,
      example: 1,
      description: 'ID do card',
    }),
    ApiQuery({
      name: 'parentId',
      required: false,
      type: Number,
      example: 10,
      description:
        'ID do comentário pai para listar respostas (omita para listar comentários de nível raiz)',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Número da página (default 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: 20,
      description: 'Itens por página (máx. 100; default 20)',
    }),
    ApiOkResponse({
      description: 'Lista paginada de comentários',
      type: PaginatedCommentsResponse,
    }),
    ApiNotFoundResponse({
      description: 'Card não encontrado.',
      schema: { example: { statusCode: 404, message: 'Card not found' } },
    }),
  );
}
