import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiNotFoundResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth/auth.guard';
import { VoteDto } from '../dto/request/updateCard';

export function SwaggerCardVote() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiOperation({ summary: 'Votar em um card (up/down)' }),
    ApiBody({
      type: VoteDto,
      examples: {
        upvote: { value: { isUpvote: true, cardId: '1' } },
        downvote: { value: { isUpvote: false, cardId: '1' } },
      },
    }),
    ApiOkResponse({
      description: 'Voto registrado.',
      example: {
        id: 2,
        title:
          'Cantina fechada há três dias: previsão de retorno e alternativas',
        description:
          'A cantina está fechada há três dias seguidos. Há previsão de reabertura? Existe alternativa temporária para compra de lanches e refeições nos intervalos?',
        author: 'Anônimo',
        up_down: 23,
        user_id: 'uid_anon_1',
        deactivated: false,
        created_at: '2024-01-14T15:45:00.000Z',
        updated_at: '2025-11-17T11:58:49.905Z',
        user_vote: 0,
      },
    }),
    ApiNotFoundResponse({
      description: 'Card não encontrado.',
      schema: {
        example: { statusCode: 404, message: 'Card not found' },
      },
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
  );
}
