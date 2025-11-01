import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class ReactionDto {
  @ApiProperty({
    enum: ['like', 'dislike', 'none'],
    example: 'like',
    description: 'Tipo de reação ao comentário (like, dislike ou none)',
  })
  @IsIn(['like', 'dislike', 'none'])
  action: 'like' | 'dislike' | 'none';
}
