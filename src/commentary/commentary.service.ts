import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CommentaryModel } from './commentary.model';
import { CommentaryReactionModel } from './commentary-reaction.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ReactionDto } from './dto/reaction.dto';
import { FirebaseService } from '../firebase/firebase.service';
import { CardService } from '../card/card.service';

type ListOptions = {
  parentCommentId?: number;
  pageNumber: number;
  itemsPerPage: number;
};

@Injectable()
export class CommentaryService {
  constructor(
    @InjectModel(CommentaryModel)
    private readonly commentModel: typeof CommentaryModel,
    @InjectModel(CommentaryReactionModel)
    private readonly reactionModel: typeof CommentaryReactionModel,
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly firebaseService: FirebaseService,
    private readonly cardService: CardService,
  ) {}

  // Lista comentários do card (nível raiz ou respostas)
  async list(
    cardId: number,
    { parentCommentId, pageNumber, itemsPerPage }: ListOptions,
  ) {
    // valida existência do card via CardService
    await this.cardService.getCardById(String(cardId));

    const where: any = { card_id: cardId, parent_id: parentCommentId ?? null };
    const offset = (pageNumber - 1) * itemsPerPage;

    const { rows, count } = await this.commentModel.findAndCountAll({
      where,
      order: [['created_at', 'ASC']],
      limit: itemsPerPage,
      offset,
    });

    return {
      data: rows,
      total: count,
      pageNumber,
      itemsPerPage,
      hasMore: offset + rows.length < count,
    };
  }

  // Cria comentário (ou reply se vier parentId)
  async create(cardId: number, dto: CreateCommentDto, userUid: string) {
    // valida card via CardService
    await this.cardService.getCardById(String(cardId));

    // valida parent (se for reply), sempre dentro do mesmo card
    if (dto.parentId) {
      const parent = await this.commentModel.findOne({
        where: { id: dto.parentId, card_id: cardId },
      });
      if (!parent) {
        throw new BadRequestException('Parent comment not found for this card');
      }
    }

    // autor pelo Firebase
    const user = await this.firebaseService.getUserByUid(userUid);
    if (!user) throw new NotFoundException('User not found');

    const created = await this.commentModel.create({
      card_id: cardId,
      user_uid: userUid,
      author: user.displayName ?? 'Usuário',
      content: dto.content,
      parent_id: dto.parentId ?? null,
      // up_down tem default no model/migration
    });

    return created;
  }

  // Atualiza comentário (somente autor)
  async update(
    cardId: number,
    commentId: number,
    dto: UpdateCommentDto,
    userUid: string,
  ) {
    // opcional: valida existência do card
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

  // Remove comentário (somente autor)
  async remove(cardId: number, commentId: number, userUid: string) {
    await this.cardService.getCardById(String(cardId));

    const comment = await this.commentModel.findOne({
      where: { id: commentId, card_id: cardId },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user_uid !== userUid) {
      throw new ForbiddenException('You cannot delete this comment');
    }

    await this.sequelize.transaction(async (transaction) => {
      await this.reactionModel.destroy({
        where: { comment_id: commentId },
        transaction,
      });
      // se não houver cascade para replies no banco, avalie remover em cascata aqui
      await comment.destroy({ transaction });
    });

    return { success: true };
  }

  // Define minha reação (like/dislike/none) e ajusta up_down
  async setReaction(
    cardId: number,
    commentId: number,
    action: ReactionDto['action'],
    userUid: string,
  ) {
    if (!['like', 'dislike', 'none'].includes(action)) {
      throw new BadRequestException('Invalid reaction');
    }

    await this.cardService.getCardById(String(cardId));

    const comment = await this.commentModel.findOne({
      where: { id: commentId, card_id: cardId },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    const scoreOf = (r: 'like' | 'dislike' | 'none') =>
      r === 'like' ? 1 : r === 'dislike' ? -1 : 0;

    await this.sequelize.transaction(async (transaction) => {
      const existing = await this.reactionModel.findOne({
        where: { comment_id: commentId, user_uid: userUid },
        transaction,
      });

      const current: 'like' | 'dislike' | 'none' =
        (existing?.action as any) ?? 'none';
      const next = action;

      const delta = scoreOf(next) - scoreOf(current);

      if (delta !== 0) {
        await comment.increment('up_down', { by: delta, transaction });
      }

      if (next === 'none') {
        if (existing) await existing.destroy({ transaction });
      } else if (existing) {
        existing.action = next;
        await existing.save({ transaction });
      } else {
        await this.reactionModel.create(
          { comment_id: commentId, user_uid: userUid, action: next },
          { transaction },
        );
      }

      const updated = await this.commentModel.findByPk(commentId, {
        attributes: ['id', 'up_down'],
        transaction,
      });

      return {
        commentId,
        up_down: updated?.up_down ?? 0,
        myReaction: next,
      };
    });
  }
}
