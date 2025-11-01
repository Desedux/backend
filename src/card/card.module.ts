import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CardModel } from './card.model';
import { FirebaseService } from '../firebase/firebase.service';
import { CardTagModel } from './card-tag.model';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [SequelizeModule.forFeature([CardModel, CardTagModel]), TagsModule],
  providers: [CardService, FirebaseService],
  controllers: [CardController],
  exports: [CardService],
})
export class CardModule {}
