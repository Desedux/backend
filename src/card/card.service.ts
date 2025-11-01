import { HttpException, Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/request/createCard';
import { InjectModel } from '@nestjs/sequelize';
import { CardModel } from './card.model';
import { FirebaseService } from '../firebase/firebase.service';
import { Op, QueryTypes } from 'sequelize';
import { TagsService } from '../tags/tags.service';
@Injectable()
export class CardService {
  constructor(
    @InjectModel(CardModel) private readonly cardModel: typeof CardModel,
    private readonly firebaseService: FirebaseService,
    private readonly tagsService: TagsService,
  ) {}

  async createCard(
    createCardDto: CreateCardDto,
    userUid: string,
  ): Promise<void> {
    const user = await this.firebaseService.getUserByUid(userUid);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const tags = await this.tagsService.getTagByIds(createCardDto.tags);
    if (!tags.length) {
      throw new HttpException('Tags not found', 400);
    }

    const card = await this.cardModel.create({
      title: createCardDto.title,
      description: createCardDto.description,
      author: createCardDto.isAnonymous ? 'Anônimo' : user.displayName!,
      user_id: userUid,
      up_down: 0,
      deactivated: false,
    });

    await card.$set(
      'tags',
      tags.map((t) => t.id),
    );
  }

  async getCardById(cardId: string): Promise<CardModel> {
    const card = await this.cardModel.findByPk(cardId);
    if (!card || card.deactivated) {
      throw new HttpException('Card not found', 404);
    }
    return card;
  }

  async getCards(page: number, category?: string): Promise<CardModel[]> {
    const limit = 20;
    const offset = (page - 1) * limit;

    const where = category
      ? { tags: { [Op.contains]: [category] }, deactivated: false }
      : { deactivated: false };

    const cards = await this.cardModel.findAll({
      where,
      limit,
      offset,
      order: [['up_down', 'DESC']],
    });

    return cards.length > 0 ? cards : [];
  }

  async getCardCategories(): Promise<string[]> {
    if (!this.cardModel.sequelize) {
      return [];
    }

    const sql = `
    SELECT DISTINCT UNNEST(tags) AS tag
    FROM card
    WHERE array_length(tags, 1) > 0
  `;

    const results = await this.cardModel.sequelize.query<{ tag: string }>(sql, {
      type: QueryTypes.SELECT,
    });

    return (results as { tag: string }[]).map((r) => r.tag);
  }

  async vote(cardId: string, like: boolean): Promise<void> {
    const card = await this.getCardById(cardId);
    if (!card) {
      throw new HttpException('Card not found', 404);
    }
    const updateData = like
      ? { up_down: card.up_down + 1 }
      : { up_down: card.up_down - 1 };
    await card.update(updateData);
  }

  async deleteCard(cardId: string, userUid: string) {
    const card = await this.getCardById(cardId);
    if (!card) {
      throw new HttpException('Card not found', 404);
    }
    if (card.user_id !== userUid) {
      throw new HttpException('Forbidden', 403);
    }
    await card.update({ deactivated: true });
  }
}
