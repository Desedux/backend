import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/auth.guard';

export function SwaggerGetProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obter perfil do usuário autenticado',
      description:
        'Valida o ID token do Firebase e retorna as claims do usuário autenticado.',
    }),
    UseGuards(AuthGuard),
    ApiBearerAuth(),
  );
}
