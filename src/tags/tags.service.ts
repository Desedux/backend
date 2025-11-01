import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TagModel } from './tags.model';
import { CardService } from '../card/card.service';
import { TagResponseDto } from './dto/response/TagResponseDto';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(TagModel) private readonly tagModel: typeof TagModel,
    @Inject(forwardRef(() => CardService))
    private readonly cardService: CardService,
  ) {}

  // async getAllTags(): Promise<TagModel[]> {
  //   return this.tagModel.findAll();
  // }

  async getAllTags(): Promise<TagResponseDto[]> {
    const tags = await this.tagModel.findAll();
    const counts = await this.cardService.getAllTagCounts();

    return tags.map((t) => {
      const j = t.toJSON();
      return {
        id: j.id,
        name: j.name,
        description: j.description ?? null,
        image_url: j.image_url ?? null,
        created_at: j.createdAt,
        updated_at: j.updatedAt,
        count: counts[j.id] ?? 0,
      } as TagResponseDto;
    });
  }

  async getTagByIds(ids: number[]): Promise<TagModel[]> {
    return this.tagModel.findAll({ where: { id: ids } });
  }

  async getTagByIdsWithCount(ids: number[]): Promise<TagResponseDto[]> {
    const tags = await this.tagModel.findAll({ where: { id: ids } });
    const counts = await this.cardService.getTagCounts(ids);

    return tags.map((t) => {
      const j = t.toJSON();
      return {
        id: j.id,
        name: j.name,
        description: j.description ?? null,
        image_url: j.image_url ?? null,
        created_at: j.createdAt,
        updated_at: j.updatedAt,
        count: counts[j.id] ?? 0,
      } as TagResponseDto;
    });
  }
}
