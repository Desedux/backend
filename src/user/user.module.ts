import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from './user.model';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [UserService, RedisService, EmailService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
