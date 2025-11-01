import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Mensagem do comentário' })
  content: string;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'ID do comentário pai para reply. Null para comentário raiz.',
  })
  parentId?: number | null;
}
