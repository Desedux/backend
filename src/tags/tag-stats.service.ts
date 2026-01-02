import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { col, fn } from 'sequelize';

import { CardTagModel } from '../card/card-tag.model';
import { CardModel } from '../card/card.model';
import { RedisService } from '../redis/redis.service';
import { getOrSet } from '../utils/cache.util';

@Injectable()
export class TagStatsService {
  private readonly tagCountsCacheKey = 'tags:counts';
  private readonly tagCountsCacheTtlSec = 300;

  constructor(
    @InjectModel(CardTagModel)
    private readonly cardTagModel: typeof CardTagModel,
    @InjectModel(CardModel)
    private readonly cardModel: typeof CardModel,
    private readonly redisService: RedisService,
  ) {}

  async getTagCount(tagId: number): Promise<number> {
    const counts = await this.getAllTagCounts();
    return counts[tagId] ?? 0;
  }

  async getTagCounts(tagIds: number[]): Promise<Record<number, number>> {
    const counts = await this.getAllTagCounts();
    const result: Record<number, number> = {};
    for (const id of tagIds) {
      result[id] = counts[id] ?? 0;
    }
    return result;
  }

  async getAllTagCounts(): Promise<Record<number, number>> {
    const { payload } = await getOrSet(
      this.redisService.client,
      this.tagCountsCacheKey,
      this.tagCountsCacheTtlSec,
      async () => await this.computeTagCounts(),
    );
    return payload;
  }

  async invalidateTagCounts(): Promise<void> {
    await this.redisService.client.del(this.tagCountsCacheKey);
  }

  private async computeTagCounts(): Promise<Record<number, number>> {
    const rows = await this.cardTagModel.findAll({
      attributes: [
        'tag_id',
        [fn('COUNT', fn('DISTINCT', col('card_tags.card_id'))), 'total'],
      ],
      include: [
        {
          model: this.cardModel,
          attributes: [],
          where: { deactivated: false },
          required: true,
        },
      ],
      group: ['card_tags.tag_id'],
      raw: true,
    });

    const counts: Record<number, number> = {};
    for (const row of rows as any[]) {
      counts[Number(row.tag_id)] = Number(row.total);
    }

    return counts;
  }
}
