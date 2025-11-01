import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CardModel } from './card.model';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { FirebaseService } from '../firebase/firebase.service';
import { TagsModule } from '../tags/tags.module';
import { CardTagModel } from './card-tag.model';
import { CardVoteModel } from './card-vote.model';

@Module({
  imports: [
    SequelizeModule.forFeature([CardModel, CardTagModel, CardVoteModel]),
    forwardRef(() => TagsModule),
  ],
  providers: [CardService, FirebaseService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
