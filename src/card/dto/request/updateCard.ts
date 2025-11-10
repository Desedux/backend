import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class VoteDto {
  @IsBoolean()
  @IsNotEmpty()
  isUpvote: boolean;

  @IsString()
  @IsNotEmpty()
  cardId: string;
}
