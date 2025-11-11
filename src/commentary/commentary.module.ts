import { Module } from '@nestjs/common';
import { CommentaryController } from './commentary.controller';
import { CommentaryService } from './commentary.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentaryModel } from './commentary.model';
import { CardModule } from '../card/card.module';
import { UserModel } from '../user/user.model';
import { CommentVoteModel } from './commentary-vote.model';

@Module({
  imports: [
    SequelizeModule.forFeature([CommentVoteModel, CommentaryModel, UserModel]),
    CardModule,
  ],
  controllers: [CommentaryController],
  providers: [CommentaryService],
})
export class CommentaryModule {}
