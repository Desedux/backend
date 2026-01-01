import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateCommentDto } from '../dto/request/create-comment.dto';
import { CommentResponseDto } from '../dto/request/comment.response.dto';

export function SwaggerCreateCommentary() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Criar comentário (top-level ou reply se parentId no body)',
    }),
    ApiParam({
      name: 'cardId',
      type: Number,
      example: 1,
      description: 'ID do card',
    }),
    ApiBody({
      description:
        'Conteúdo do comentário. Envie parentId para responder a um comentário.',
      type: CreateCommentDto,
    }),
    ApiCreatedResponse({
      description: 'Comentário criado com sucesso.',
      type: CommentResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Dados inválidos ou parentId não pertence ao card.',
      schema: {
        example: {
          statusCode: 400,
          message: 'Parent comment not found for this card',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Usuário não autenticado.',
      schema: { example: { statusCode: 401, message: 'Unauthorized' } },
    }),
    ApiNotFoundResponse({
      description: 'Card ou usuário não encontrado.',
      schema: { example: { statusCode: 404, message: 'Card not found' } },
    }),
  );
}
