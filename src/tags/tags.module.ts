import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagModel } from './tags.model';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagStatsService } from './tag-stats.service';
import { CardTagModel } from '../card/card-tag.model';
import { CardModel } from '../card/card.model';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    SequelizeModule.forFeature([TagModel, CardTagModel, CardModel]),
    RedisModule,
  ],
  providers: [TagsService, TagStatsService],
  controllers: [TagsController],
  exports: [TagsService, TagStatsService],
})
export class TagsModule {}
