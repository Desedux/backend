import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CardModel } from './card.model';
import { FirebaseService } from '../firebase/firebase.service';
import { TagsService } from '../tags/tags.service';
import { TagModel } from '../tags/tags.model';
import { CardTagModel } from './card-tag.model';

@Module({
  imports: [SequelizeModule.forFeature([CardModel, TagModel, CardTagModel])],
  providers: [CardService, FirebaseService, TagsService],
  controllers: [CardController],
})
export class CardModule {}
