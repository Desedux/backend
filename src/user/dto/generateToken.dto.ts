import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsNewtonPaivaEmail } from '../../decorator/email-validator.decorator';

export class GenerateTokenDto {
  @ApiProperty({
    example: 'gabrielmarliere2005@alunos.newtonpaiva.edu.br',
    description: "The user's institutional email address",
  })
  @IsNotEmpty()
  @IsEmail()
  @IsNewtonPaivaEmail()
  email!: string;
}
