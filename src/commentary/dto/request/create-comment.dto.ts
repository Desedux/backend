import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @ApiProperty({ example: 'Mensagem do comentário' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'ID do comentário pai para reply. Null para comentário raiz.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number | null;
}
