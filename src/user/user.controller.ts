import {
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FirebaseService } from '../firebase/firebase.service';
import { ApiTags } from '@nestjs/swagger';
import { IdToken } from '../auth/id-token.decorator';
import { GenerateTokenDto } from './dto/generateToken.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { SwaggerCreateUser } from './docs/create.swagger';
import { SwaggerChangePassword } from './docs/change-password.swagger';
import { SwaggerRefactorToken } from './docs/refactor-token.swagger';
import { SwaggerVerificationToken } from './docs/verification-token.swagger';
import { SwaggerGetProfile } from './docs/profile.swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Post('register')
  @SwaggerCreateUser()
  async registerUser(@Body() dto: RegisterUserDto) {
    const user = await this.userService.registerUser(dto);
    if (user) {
      return { message: 'User registered successfully.', statusCode: 201 };
    }
    throw new HttpException('Error registering user.', 500);
  }

  @Patch('change-password')
  @SwaggerChangePassword()
  async changePassword(@Body() dto: ChangePasswordDto) {
    await this.userService.changePassword(dto);
    return { message: 'Password changed successfully', status: 200 };
  }

  @Post('refactor-token')
  @SwaggerRefactorToken()
  async createToken(@Body() dto: GenerateTokenDto) {
    await this.userService.sendRefactorCodeMail(dto.email);
    return {
      message: 'If the email is registered, a code has been sent',
      status: 200,
    };
  }

  @Post('verification-token')
  @SwaggerVerificationToken()
  async createVerificationToken(@Body() dto: GenerateTokenDto) {
    await this.userService.sendVerificationCode(dto.email);
    return { message: 'Verification code sent to your email' };
  }

  @Get('profile')
  @SwaggerGetProfile()
  async profile(@IdToken() token: string) {
    return await this.firebaseService.verifyIdToken(token);
  }
}
