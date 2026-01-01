import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

export function SwaggerVerificationToken() {
  return applyDecorators(
    ApiOperation({
      summary: 'Enviar código de verificação de cadastro',
      description:
        'Gera e envia um código de verificação para finalizar o registro de novos usuários.',
    }),
    ApiOkResponse({
      description: 'Verification code sent to your email',
      schema: {
        example: { message: 'Verification code sent to your email' },
      },
    }),
    ApiBadRequestResponse({
      description: 'Account with this email already exist.',
      schema: {
        example: {
          statusCode: 400,
          message: 'Account with this email already exist',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Error sending code.',
      schema: {
        example: {
          statusCode: 500,
          message: 'Error sending code.',
        },
      },
    }),
  );
}
