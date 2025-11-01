import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import {
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login.response.dto';
import { RefreshResponseDto } from './dto/refresh.response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login com e-mail e senha',
    description:
      'Valida as credenciais do usuário e retorna o access token e o refresh token (JWT), além de metadados básicos do usuário.',
  })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid login credentials',
        error: 'Bad Request',
      },
    },
  })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(dto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Atualizar token de acesso',
    description:
      'Recebe um refresh token válido e gera um novo access token sem exigir novo login.',
  })
  @ApiOkResponse({
    description: 'Token refreshed successfully',
    type: RefreshResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid refresh token',
        error: 'Bad Request',
      },
    },
  })
  async refresh(@Body() dto: RefreshDto): Promise<RefreshResponseDto> {
    return await this.authService.refresh(dto.refreshToken);
  }
}
