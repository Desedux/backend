import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { ApiBearerAuth, ApiNoContentResponse } from '@nestjs/swagger';

export function SwaggerDeleteCommentary() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiNoContentResponse({ description: 'Comentário desativado.' }),
  );
}
