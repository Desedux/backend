import { HttpException, Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/request/createCard';
import { InjectModel } from '@nestjs/sequelize';
import { CardModel } from './card.model';
import { FirebaseService } from '../firebase/firebase.service';
import { TagsService } from '../tags/tags.service';
import { CardVoteModel } from './card-vote.model';
import { TagModel } from '../tags/tags.model';
import { TagStatsService } from '../tags/tag-stats.service';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(CardModel) private readonly cardModel: typeof CardModel,
    @InjectModel(CardVoteModel)
    private readonly cardVoteModel: typeof CardVoteModel,
    private readonly firebaseService: FirebaseService,
    private readonly tagsService: TagsService,
    private readonly tagStatsService: TagStatsService,
  ) {}

  async createCard(
    createCardDto: CreateCardDto,
    userUid: string,
  ): Promise<CardModel> {
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
    await this.tagStatsService.invalidateTagCounts();
    return card;
  }

  async getCardById(cardId: string, userUid?: string): Promise<CardModel> {
    const card = await this.cardModel.findByPk(cardId);
    if (!card || card.deactivated)
      throw new HttpException('Card not found', 404);

    let userVote = 0;

    if (userUid) {
      const existingVote = await this.cardVoteModel.findOne({
        where: {
          card_id: card.id,
          user_id: userUid,
        },
      });

      if (existingVote) {
        userVote = existingVote.vote;
      }
    }

    (card as any).setDataValue('user_vote', userVote);

    return card;
  }

  async getCards(
    page: number,
    category?: number,
    userUid?: string,
  ): Promise<CardModel[]> {
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
    if (cards.length === 0) return [];

    if (!userUid) {
      for (const card of cards) {
        (card as any).setDataValue('user_vote', 0);
      }
      return cards;
    }

    for (const card of cards) {
      const existingVote = await this.cardVoteModel.findOne({
        where: {
          card_id: card.id,
          user_id: userUid,
        },
      });

      const userVote = existingVote ? existingVote.vote : 0;
      (card as any).setDataValue('user_vote', userVote);
    }

    return cards;
  }

  async vote(
    cardId: string,
    like: boolean,
    userUid: string,
  ): Promise<CardModel> {
    const card = await this.getCardById(cardId);

    const existingVote = await this.cardVoteModel.findOne({
      where: {
        card_id: card.id,
        user_id: userUid,
      },
    });

    const currentVote = existingVote ? existingVote.vote : 0;
    let newVote: number;

    if (like) {
      if (currentVote === 1) {
        newVote = 0;
      } else if (currentVote === 0) {
        newVote = 1;
      } else {
        newVote = 0;
      }
    } else {
      if (currentVote === -1) {
        newVote = 0;
      } else if (currentVote === 0) {
        newVote = -1;
      } else {
        newVote = 0;
      }
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

    const updatedSum = Number(sumRaw ?? 0);
    const updatedCard = await card.update({ up_down: updatedSum });

    return updatedCard;
  }

  async deleteCard(cardId: string, userUid: string) {
    const card = await this.getCardById(cardId);
    if (card.user_id !== userUid) throw new HttpException('Forbidden', 403);
    await card.update({ deactivated: true });

    await this.tagStatsService.invalidateTagCounts();
  }
}
