import { ApiProperty } from '@nestjs/swagger';
import { CommentResponseDto } from '../request/comment.response.dto';

export class PaginatedCommentsResponse {
  @ApiProperty({ type: [CommentResponseDto] })
  data!: CommentResponseDto[];

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 1 })
  pageNumber!: number;

  @ApiProperty({ example: 20 })
  itemsPerPage!: number;

  @ApiProperty({ example: true })
  hasMore!: boolean;
}
