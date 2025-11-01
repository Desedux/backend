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
  UseGuards,
} from '@nestjs/common';
import { CommentaryService } from './commentary.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ReactionDto } from './dto/reaction.dto';
import { UserUid } from '../decorator/user-uid.decorator';

@ApiTags('commentary')
@Controller('commentary')
export class CommentaryController {
  constructor(private readonly commentaryService: CommentaryService) {}

  @Get(':cardId')
  async list(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Query('parentId') parentId?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const p = Number(page) || 1;
    const l = Math.min(Number(limit) || 20, 100);
    const pid = parentId ? Number(parentId) : undefined;
    return await this.commentaryService.list(cardId, {
      parentCommentId: pid,
      pageNumber: p,
      itemsPerPage: l,
    });
  }

  @UseGuards(AuthGuard)
  @Post(':cardId')
  async create(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() dto: CreateCommentDto,
    @UserUid() userUid: string,
  ) {
    return this.commentaryService.create(cardId, dto, userUid);
  }

  @UseGuards(AuthGuard)
  @Patch(':cardId/:commentId')
  async update(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: UpdateCommentDto,
    @UserUid() userUid: string,
  ) {
    return this.commentaryService.update(cardId, commentId, dto, userUid);
  }

  @UseGuards(AuthGuard)
  @Delete(':cardId/:commentId')
  async remove(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @UserUid() userUid: string,
  ) {
    return this.commentaryService.remove(cardId, commentId, userUid);
  }

  @UseGuards(AuthGuard)
  @Patch(':cardId/:commentId/reaction')
  async setReaction(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: ReactionDto,
    @UserUid() userUid: string,
  ) {
    return this.commentaryService.setReaction(
      cardId,
      commentId,
      dto.action,
      userUid,
    );
  }
}
