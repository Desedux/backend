import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

export function SwaggerChangePassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Alterar senha',
      description:
        'Atualiza a senha usando o código de verificação enviado por e-mail. Em caso de sucesso retorna uma mensagem de confirmação.',
    }),
    ApiOkResponse({
      description: 'Password changed successfully',
      schema: {
        example: { message: 'Password changed successfully', status: 200 },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid token.',
      schema: {
        example: {
          statusCode: 400,
          message: 'Invalid token',
        },
      },
    }),
    ApiTooManyRequestsResponse({
      description: 'Too many attempts, please request a new token.',
      schema: {
        example: {
          statusCode: 429,
          message: 'Too many attempts, please request a new token',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error.',
      schema: {
        example: {
          statusCode: 500,
          message: 'Error changing password',
        },
      },
    }),
  );
}
