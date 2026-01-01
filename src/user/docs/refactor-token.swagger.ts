import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

export function SwaggerRefactorToken() {
  return applyDecorators(
    ApiOperation({
      summary: 'Enviar código para redefinição',
      description:
        'Se o e-mail estiver cadastrado, envia um código para redefinição de senha. A resposta é genérica para não expor a existência do e-mail.',
    }),
    ApiOkResponse({
      description: 'If the email is registered, a code has been sent',
      schema: {
        example: {
          statusCode: 200,
          message: 'If the email is registered, a code has been sent',
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
