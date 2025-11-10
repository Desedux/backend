import {
  HttpException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateCardDto } from './dto/request/createCard';
import { InjectModel } from '@nestjs/sequelize';
import { CardModel } from './card.model';
import { FirebaseService } from '../firebase/firebase.service';
import { QueryTypes } from 'sequelize';
import { TagsService } from '../tags/tags.service';
import { Interval } from '@nestjs/schedule';
import { TagModel } from '../tags/tags.model';
import { CardVoteModel } from './card-vote.model';

@Injectable()
export class CardService implements OnModuleInit {
  private logger: Logger = new Logger();

  constructor(
    @InjectModel(CardModel) private readonly cardModel: typeof CardModel,
    @InjectModel(CardVoteModel)
    private readonly cardVoteModel: typeof CardVoteModel,
    private readonly firebaseService: FirebaseService,
    private readonly tagsService: TagsService,
  ) {}

  private tagCountCache = new Map<number, number>();
  private lastCountsRefreshAt = 0;

  async onModuleInit() {
    await this.refreshTagCounts();
  }

  @Interval(5 * 60 * 1000)
  async scheduledRefreshTagCounts() {
    await this.refreshTagCounts();
  }

  private async refreshTagCounts() {
    if (!this.cardModel.sequelize) return;
    const rows = await this.cardModel.sequelize.query<{
      tag_id: number;
      total: any;
    }>(
      `
          SELECT ct.tag_id, COUNT(DISTINCT c.id) AS total
          FROM card_tags ct
                   JOIN card c ON c.id = ct.card_id AND c.deactivated = false
          GROUP BY ct.tag_id
      `,
      { type: QueryTypes.SELECT },
    );

    const next = new Map<number, number>();
    for (const r of rows) next.set(Number(r.tag_id), Number(r.total));
    this.tagCountCache = next;
    this.lastCountsRefreshAt = Date.now();
  }

  private async refreshSingleTag(tagId: number) {
    if (!this.cardModel.sequelize) return;
    const row = await this.cardModel.sequelize.query<{ total: any }>(
      `
          SELECT COUNT(DISTINCT c.id) AS total
          FROM card_tags ct
                   JOIN card c ON c.id = ct.card_id AND c.deactivated = false
          WHERE ct.tag_id = :tagId
      `,
      { type: QueryTypes.SELECT, replacements: { tagId } },
    );
    const total = row.length ? Number(row[0].total) : 0;
    this.tagCountCache.set(tagId, total);
  }

  async getTagCount(tagId: number): Promise<number> {
    const hit = this.tagCountCache.get(tagId);
    if (typeof hit === 'number') return hit;
    await this.refreshSingleTag(tagId);
    return this.tagCountCache.get(tagId) ?? 0;
  }

  async getTagCounts(tagIds: number[]): Promise<Record<number, number>> {
    const result: Record<number, number> = {};
    const missing: number[] = [];
    for (const id of tagIds) {
      const hit = this.tagCountCache.get(id);
      if (typeof hit === 'number') result[id] = hit;
      else missing.push(id);
    }
    if (missing.length && this.cardModel.sequelize) {
      const rows = await this.cardModel.sequelize.query<{
        tag_id: number;
        total: any;
      }>(
        `
            SELECT ct.tag_id, COUNT(DISTINCT c.id) AS total
            FROM card_tags ct
                     JOIN card c ON c.id = ct.card_id AND c.deactivated = false
            WHERE ct.tag_id IN (:ids)
            GROUP BY ct.tag_id
        `,
        { type: QueryTypes.SELECT, replacements: { ids: missing } },
      );
      const found = new Set<number>();
      for (const r of rows) {
        const id = Number(r.tag_id);
        const total = Number(r.total);
        this.tagCountCache.set(id, total);
        result[id] = total;
        found.add(id);
      }
      for (const id of missing) {
        if (!found.has(id)) {
          this.tagCountCache.set(id, 0);
          result[id] = 0;
        }
      }
    }
    return result;
  }

  async getAllTagCounts(): Promise<Record<number, number>> {
    if (!this.tagCountCache.size) await this.refreshTagCounts();
    const out: Record<number, number> = {};
    for (const [k, v] of this.tagCountCache.entries()) out[k] = v;
    return out;
  }

  async createCard(
    createCardDto: CreateCardDto,
    userUid: string,
  ): Promise<void> {
    const user = await this.firebaseService.getUserByUid(userUid);
    if (!user) throw new HttpException('User not found', 404);

    const tags = await this.tagsService.getTagByIds(createCardDto.tags);
    if (!tags.length) throw new HttpException('Tags not found', 400);

    const card = await this.cardModel.create({
      title: createCardDto.title,
      description: createCardDto.description,
      author: createCardDto.isAnonymous ? 'Anônimo' : user.displayName!,
      user_id: userUid,
      up_down: 0,
      deactivated: false,
    });

    const tagIds = tags.map((t) => t.id);
    await card.$set('tags', tagIds);
    for (const id of tagIds)
      this.tagCountCache.set(id, (this.tagCountCache.get(id) ?? 0) + 1);
  }

  async getCardById(cardId: string): Promise<CardModel> {
    const card = await this.cardModel.findByPk(cardId);
    if (!card || card.deactivated)
      throw new HttpException('Card not found', 404);
    return card;
  }

  async getCards(page: number, category?: number): Promise<CardModel[]> {
    const limit = 20;
    const offset = (page - 1) * limit;

    const options: any = {
      where: { deactivated: false },
      limit,
      offset,
      order: [['up_down', 'DESC']],
    };

    if (category) {
      options.include = [
        {
          model: TagModel,
          attributes: [],
          through: { attributes: [] },
          where: { id: category },
          required: true,
        },
      ];
      options.distinct = true;
    }

    const cards = await this.cardModel.findAll(options);
    return cards.length > 0 ? cards : [];
  }

  async getCardCategories(): Promise<string[]> {
    if (!this.cardModel.sequelize) return [];
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

  async vote(cardId: string, like: boolean, userUid: string): Promise<void> {
    const card = await this.getCardById(cardId);
    const newVote = like ? 1 : -1;

    const existingVote = await this.cardVoteModel.findOne({
      where: {
        card_id: card.id,
        user_id: userUid,
      },
    });

    if (existingVote && existingVote.vote === newVote) {
      this.logger.warn(
        `User ${userUid} attempted to vote the same way again on card ${cardId}`,
      );
      return;
    }

    if (!existingVote) {
      await this.cardVoteModel.create({
        card_id: card.id!,
        user_id: userUid,
        vote: newVote,
      });
    } else {
      await existingVote.update({ vote: newVote });
    }

    const sumRaw = await this.cardVoteModel.sum('vote', {
      where: { card_id: card.id },
    });

    let updatedSum = Number(sumRaw ?? 0) - newVote;
    if (updatedSum < 0) {
      updatedSum = 0;
    }
    await card.update({ up_down: updatedSum });
  }

  async deleteCard(cardId: string, userUid: string) {
    const card = await this.getCardById(cardId);
    if (card.user_id !== userUid) throw new HttpException('Forbidden', 403);
    await card.update({ deactivated: true });

    if (this.cardModel.sequelize) {
      const rows = await this.cardModel.sequelize.query<{ tag_id: number }>(
        `SELECT tag_id
         FROM card_tags
         WHERE card_id = :cardId`,
        { type: QueryTypes.SELECT, replacements: { cardId } },
      );
      for (const r of rows) {
        const id = Number(r.tag_id);
        this.tagCountCache.set(
          id,
          Math.max(0, (this.tagCountCache.get(id) ?? 0) - 1),
        );
      }
    }
  }
}
