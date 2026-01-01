import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

export function SwaggerCreateUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Registrar usuário',
      description:
        'Cria a conta a partir do e-mail, código de verificação e senha. Retorna uma mensagem de sucesso quando o registro é concluído.',
    }),
    ApiCreatedResponse({
      description: 'User registered successfully',
      schema: {
        example: { message: 'User registered successfully.', statusCode: 201 },
      },
    }),
    ApiBadRequestResponse({
      description: 'Response when code is not equal to the sent one.',
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
          message: 'Too many attempts, please request a new token.',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error.',
      schema: {
        example: {
          statusCode: 500,
          message: 'Error registering user.',
        },
      },
    }),
  );
}
