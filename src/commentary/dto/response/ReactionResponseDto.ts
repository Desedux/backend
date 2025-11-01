import { ApiProperty } from '@nestjs/swagger';

export class ReactionResponseDto {
  @ApiProperty({ example: 123 })
  commentId!: number;

  @ApiProperty({ example: 7 })
  up_down!: number;

  @ApiProperty({ enum: ['like', 'dislike', 'none'], example: 'like' })
  myReaction!: 'like' | 'dislike' | 'none';
}