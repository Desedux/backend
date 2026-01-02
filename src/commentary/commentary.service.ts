import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CommentaryModel } from './commentary.model';
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { UpdateCommentDto } from './dto/request/update-comment.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { CardService } from '../card/card.service';
import { CommentVoteModel } from './commentary-vote.model';

type ListOptions = {
  parentCommentId?: number;
  pageNumber: number;
  itemsPerPage: number;
};

@Injectable()
export class CommentaryService {
  private logger: Logger = new Logger();

  constructor(
    @InjectModel(CommentaryModel)
    private readonly commentModel: typeof CommentaryModel,
    @InjectModel(CommentVoteModel)
    private readonly commentVoteModel: typeof CommentVoteModel,
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly firebaseService: FirebaseService,
    private readonly cardService: CardService,
  ) {}

  async list(
    cardId: number,
    { parentCommentId, pageNumber, itemsPerPage }: ListOptions,
    userUid?: string,
  ) {
    await this.cardService.getCardById(String(cardId));

    const where: any = { card_id: cardId };

    if (parentCommentId !== undefined && parentCommentId !== null) {
      where.parent_id = parentCommentId;
    }

    const offset = (pageNumber - 1) * itemsPerPage;

    const { rows, count } = await this.commentModel.findAndCountAll({
      where,
      order: [['created_at', 'ASC']],
      limit: itemsPerPage,
      offset,
    });

    if (rows.length === 0) {
      return {
        data: [],
        total: count,
        pageNumber,
        itemsPerPage,
        hasMore: false,
      };
    }

    const hasMore = offset + rows.length < count;

    if (!userUid) {
      for (const comment of rows) {
        if (comment.deactivate) {
          (comment as any).setDataValue(
            'content',
            'Este comentário foi deletado pelo autor',
          );
        }

        (comment as any).setDataValue('user_vote', 0);
      }

      return {
        data: rows,
        total: count,
        pageNumber,
        itemsPerPage,
        hasMore,
      };
    }

    for (const comment of rows) {
      if (comment.deactivate) {
        (comment as any).setDataValue(
          'content',
          'Este comentário foi deletado pelo autor',
        );
      }

      const existingVote = await this.commentVoteModel.findOne({
        where: {
          comment_id: comment.id,
          user_id: userUid,
        },
      });

      const userVote = existingVote ? existingVote.vote : 0;
      (comment as any).setDataValue('user_vote', userVote);
    }

    return {
      data: rows,
      total: count,
      pageNumber,
      itemsPerPage,
      hasMore,
    };
  }

  async create(cardId: number, dto: CreateCommentDto, userUid: string) {
    await this.cardService.getCardById(String(cardId));

    if (dto.parentId) {
      const parent = await this.commentModel.findOne({
        where: { id: dto.parentId, card_id: cardId },
      });
      if (!parent) {
        throw new BadRequestException('Parent comment not found for this card');
      }
    }

    const user = await this.firebaseService.getUserByUid(userUid);
    if (!user) throw new NotFoundException('User not found');

    const created = await this.commentModel.create({
      card_id: cardId,
      user_uid: userUid,
      author: user.displayName ?? 'Usuário',
      content: dto.content,
      parent_id: dto.parentId ?? null,
    });

    return created;
  }

  async update(
    cardId: number,
    commentId: number,
    dto: UpdateCommentDto,
    userUid: string,
  ) {
    await this.cardService.getCardById(String(cardId));

    const comment = await this.commentModel.findOne({
      where: { id: commentId, card_id: cardId },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user_uid !== userUid) {
      throw new ForbiddenException('You cannot edit this comment');
    }

    comment.content = dto.content;
    await comment.save();
    return comment;
  }

  async vote(
    cardId: string,
    commentId: string,
    like: boolean,
    userUid: string,
  ): Promise<CommentaryModel> {
    const card = await this.cardService.getCardById(cardId);

    const comment = await this.commentModel.findOne({
      where: { id: commentId, card_id: card.id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existingVote = await this.commentVoteModel.findOne({
      where: {
        comment_id: comment.id,
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
      await this.commentVoteModel.create({
        comment_id: comment.id,
        user_id: userUid,
        vote: newVote,
      });
    } else {
      await existingVote.update({ vote: newVote });
    }

    const sumRaw = await this.commentVoteModel.sum('vote', {
      where: { comment_id: comment.id },
    });

    const updatedSum = Number(sumRaw ?? 0);
    const updatedComment = await comment.update({ up_down: updatedSum });

    (updatedComment as any).setDataValue('user_vote', newVote);

    return updatedComment;
  }

  async delete(
    cardId: number,
    commentaryId: number,
    userUid: string,
  ): Promise<CommentaryModel> {
    const comment = await this.commentModel.findOne({
      where: { id: commentaryId, card_id: cardId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user_uid !== userUid) {
      throw new ForbiddenException('You cannot delete this comment');
    }

    if (comment.deactivate) {
      return comment;
    }

    comment.deactivate = true;
    await comment.save();

    return comment;
  }
}
