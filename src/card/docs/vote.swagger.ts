import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth/auth.guard';
import { VoteDto } from '../dto/request/updateCard';

export function SwaggerCardVote() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiOperation({ summary: 'Votar em um card (up/down)' }),
    ApiBody({
      examples: {},
      description: 'ID do card',
    }),
    ApiBody({
      type: VoteDto,
      examples: {
        upvote: { value: { isUpvote: true, cardId: '1' } },
        downvote: { value: { isUpvote: false, cardId: '1' } },
      },
    }),
    ApiNoContentResponse({ description: 'Voto registrado.' }),
    ApiNotFoundResponse({
      description: 'Card não encontrado.',
      schema: { example: { statusCode: 404, message: 'Card not found' } },
    }),
    ApiForbiddenResponse({
      description: 'Não autenticado.',
      schema: { example: { statusCode: 403, message: 'Forbidden Access' } },
    }),
    ApiConflictResponse({
      description: 'Usuário já votou da mesma forma anteriormente.',
      schema: { example: { statusCode: 409, message: 'Conflict' } },
    }),
  );
}
