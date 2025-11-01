import { Module } from '@nestjs/common';
import { CommentaryController } from './commentary.controller';
import { CommentaryService } from './commentary.service';

@Module({
  controllers: [CommentaryController],
  providers: [CommentaryService]
})
export class CommentaryModule {}
