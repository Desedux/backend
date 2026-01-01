import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommentaryService } from './commentary.service';
import { CreateCommentDto } from './dto/request/create-comment.dto';
import { UpdateCommentDto } from './dto/request/update-comment.dto';
import { VoteCommentaryDto } from './dto/request/reaction.dto';
import { UserUid } from '../decorator/user-uid.decorator';
import { CommentaryModel } from './commentary.model';
import { SwaggerListCommentary } from './docs/get-all.swagger';
import { SwaggerCreateCommentary } from './docs/create.swagger';
import { SwaggerEditCommentary } from './docs/edit.swagger';
import { SwaggerVoteCommentary } from './docs/vote.swagger';
import { SwaggerDeleteCommentary } from './docs/delete.swagger';

@ApiTags('commentary')
@Controller('commentary')
export class CommentaryController {
  constructor(private readonly commentaryService: CommentaryService) {}

  @Get(':cardId')
  @SwaggerListCommentary()
  async list(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Query('parentId') parentId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @UserUid() userUid?: string,
  ) {
    const pageNumber = Number(page) || 1;
    const itemsPerPage = Math.min(Number(limit) || 20, 100);
    const parentCommentId = parentId ? Number(parentId) : undefined;

    return await this.commentaryService.list(
      cardId,
      {
        parentCommentId,
        pageNumber,
        itemsPerPage,
      },
      userUid,
    );
  }

  @Post(':cardId')
  @SwaggerCreateCommentary()
  async create(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() dto: CreateCommentDto,
    @UserUid() userUid: string,
  ) {
    return this.commentaryService.create(cardId, dto, userUid);
  }

  @Patch(':cardId/:commentId')
  @SwaggerEditCommentary()
  async update(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: UpdateCommentDto,
    @UserUid() userUid: string,
  ) {
    return this.commentaryService.update(cardId, commentId, dto, userUid);
  }

  @Patch()
  @SwaggerVoteCommentary()
  async voteCard(
    @Body() dto: VoteCommentaryDto,
    @UserUid() userUid: string,
  ): Promise<CommentaryModel> {
    return await this.commentaryService.vote(
      dto.cardId,
      dto.commentaryId,
      dto.isUpvote,
      userUid,
    );
  }

  @Delete(':cardId/:commentId')
  @SwaggerDeleteCommentary()
  async delete(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @UserUid() userUid: string,
  ): Promise<CommentaryModel> {
    return await this.commentaryService.delete(cardId, commentId, userUid);
  }
}
