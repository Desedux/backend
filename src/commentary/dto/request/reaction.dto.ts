import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VoteCommentaryDto {
  @IsBoolean()
  @IsNotEmpty()
  isUpvote: boolean;

  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsOptional()
  commentaryId: string;
}
