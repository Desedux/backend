import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TagModel } from './tags.model';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(TagModel) private readonly tagModel: typeof TagModel,
  ) {}

  async getAllTags(): Promise<TagModel[]> {
    return this.tagModel.findAll();
  }

  async getTagsByI(names: string[]): Promise<TagModel[]> {
    return this.tagModel.findAll({
      where: {
        name: names,
      },
    });
  }

  async getTagByIds(ids: number[]): Promise<TagModel[]> {
    return this.tagModel.findAll({
      where: {
        id: ids,
      },
    });
  }
}
