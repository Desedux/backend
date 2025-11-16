export interface CardWithUserVoteDto {
  id: number;
  title: string;
  description: string;
  author: string;
  up_down: number;
  user_id: string;
  deactivated: boolean;
  created_at: Date;
  updated_at: Date;
  user_vote: number;
}
