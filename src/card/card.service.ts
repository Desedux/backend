import { HttpException, Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/request/createCard';
import { InjectModel } from '@nestjs/sequelize';
import { CardModel } from './card.model';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(CardModel) private readonly cardModel: typeof CardModel,
    private readonly firebaseService: FirebaseService,
  ) {}

  async createCard(
    createCardDto: CreateCardDto,
    userUid: string,
  ): Promise<void> {
    const user = await this.firebaseService.getUserByUid(userUid);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    await this.cardModel.create({
      title: createCardDto.title,
      description: createCardDto.description,
      tags: createCardDto.tags,
      author: createCardDto.isAnonymous ? 'Anônimo' : user.displayName!,
      user_id: userUid,
      up_down: 0,
    });
  }
}
