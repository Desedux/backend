import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class GenerateTokenDto {
  @ApiProperty({
    example: 'gabrielmarliere2005@alunos.newtonpaiva.edu.br',
    description: "The user's institutional email address",
  })
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^[A-Za-z0-9._%+-]+@(alunos|professores)\.newtonpaiva\.edu\.br$/, {
    message:
      'The email must belong to the domains alunos.newtonpaiva.edu.br or professores.newtonpaiva.edu.br.',
  })
  email!: string;
}
