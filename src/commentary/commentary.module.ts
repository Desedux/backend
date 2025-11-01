import { Module } from '@nestjs/common';
import { CommentaryController } from './commentary.controller';
import { CommentaryService } from './commentary.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentaryReactionModel } from './commentary-reaction.model';
import { CommentaryModel } from './commentary.model';
import { CardModule } from '../card/card.module';

@Module({
  imports: [
    SequelizeModule.forFeature([CommentaryReactionModel, CommentaryModel]),
    CardModule,
  ],
  controllers: [CommentaryController],
  providers: [CommentaryService],
})
export class CommentaryModule {}
