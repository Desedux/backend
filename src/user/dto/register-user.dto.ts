import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'Gabriel', description: "The user's first name" })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({
    example: '12345',
    description:
      'Five-digit verification code sent to the user’s email for create account',
  })
  @IsNotEmpty()
  @IsString()
  token!: string;

  @ApiProperty({
    example: 'gabrielmarliere2005@alunos.newtonpaiva.edu.br',
    description: "The user's institutional email address",
  })
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[A-Za-z0-9._%+-]+@(alunos|professores)\.newtonpaiva\.edu\.br$/, {
    message:
      'O e-mail deve pertencer aos domínios alunos.newtonpaiva.edu.br ou professores.newtonpaiva.edu.br',
  })
  email!: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: "The user's password",
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password!: string;
}
