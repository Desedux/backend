import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-56789abcde02' })
  id: string;

  @ApiProperty({ example: 'c7f1a2b0-0f4d-4d3f-8b6a-9b1c2d3e4f5a' })
  card_id: string;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'ID do comentário pai quando for reply.',
  })
  parent_id: string | null;

  @ApiProperty({ example: 'Mensagem do comentário' })
  content: string;

  @ApiProperty({ example: 'Alice' })
  author: string;

  @ApiProperty({ example: 'uid_abc123' })
  user_id: string;

  @ApiProperty({ example: 12 })
  likesCount: number;

  @ApiProperty({ example: 3 })
  dislikesCount: number;

  @ApiProperty({
    enum: ['like', 'dislike', null],
    example: 'like',
    nullable: true,
  })
  myReaction: 'like' | 'dislike' | null;

  @ApiProperty({ type: String, format: 'date-time' })
  created_at: string;

  @ApiProperty({ type: String, format: 'date-time' })
  updated_at: string;

  @ApiProperty({ type: () => [CommentResponseDto], required: false })
  replies?: CommentResponseDto[];
}
