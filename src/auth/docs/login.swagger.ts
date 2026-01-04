import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

import { LoginResponseDto } from '../dto/login.response.dto';

export function SwaggerLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login com e-mail e senha',
      description:
        'Valida as credenciais do usuário e retorna o access token e o refresh token (JWT), além de metadados básicos do usuário.',
    }),
    ApiOkResponse({
      description: 'User logged in successfully',
      type: LoginResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid email or password',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid login credentials',
          error: 'Unauthorized',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Firebase returned a unknown response',
      schema: {
        example: {
          statusCode: 500,
          message: 'Something went wrong',
          error: 'Internal Server Error',
        },
      },
    }),
  );
}
