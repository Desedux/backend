import { IsBoolean, IsNotEmpty } from 'class-validator';

export class VoteDto {
  @IsBoolean()
  @IsNotEmpty()
  isUpvote: boolean;
}
