import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { VoteCommentaryDto } from '../dto/request/reaction.dto';

export function SwaggerVoteCommentary() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiOperation({ summary: 'Votar em um card (up/down)' }),
    ApiBody({
      examples: {},
      description: 'ID do card',
    }),
    ApiBody({
      type: VoteCommentaryDto,
      examples: {
        upvote: { value: { isUpvote: true, cardId: '1', commentaryId: null } },
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
      description: 'Voto já registrado da mesma forma.',
      schema: {
        example: { statusCode: 409, message: 'Vote already recorded' },
      },
    }),
  );
}
