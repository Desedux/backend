import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommentResponseDto } from '../dto/request/comment.response.dto';
import { UpdateCommentDto } from '../dto/request/update-comment.dto';

export function SwaggerEditCommentary() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Editar comentário (somente autor)' }),
    ApiParam({
      name: 'cardId',
      type: Number,
      example: 1,
      description: 'ID do card',
    }),
    ApiParam({
      name: 'commentId',
      type: Number,
      example: 10,
      description: 'ID do comentário',
    }),
    ApiBody({
      description: 'Novo conteúdo do comentário',
      type: UpdateCommentDto,
    }),
    ApiOkResponse({
      description: 'Comentário atualizado.',
      type: CommentResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Usuário não autenticado.',
      schema: { example: { statusCode: 401, message: 'Unauthorized' } },
    }),
    ApiForbiddenResponse({
      description: 'Edição não permitida (não é o autor).',
      schema: {
        example: { statusCode: 403, message: 'You cannot edit this comment' },
      },
    }),
    ApiNotFoundResponse({
      description: 'Card ou comentário não encontrado.',
      schema: { example: { statusCode: 404, message: 'Comment not found' } },
    }),
  );
}
