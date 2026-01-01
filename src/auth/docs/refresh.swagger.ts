import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RefreshResponseDto } from '../dto/refresh.response.dto';

export function SwaggerRefresh() {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar token de acesso',
      description:
        'Recebe um refresh token válido e gera um novo access token sem exigir novo login.',
    }),
    ApiOkResponse({
      description: 'Token refreshed successfully',
      type: RefreshResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid or expired refresh token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid refresh token',
          error: 'Bad Request',
        },
      },
    }),
  );
}
