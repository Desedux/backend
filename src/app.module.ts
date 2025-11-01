import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardModule } from './card/card.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommentaryModule } from './commentary/commentary.module';
import { FirebaseModule } from './firebase/firebase.module';
import { TagsModule } from './tags/tags.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'admin',
      password: process.env.POSTGRES_PASSWORD || 'secretpassword',
      database: process.env.POSTGRES_DB || 'mydatabase',
      autoLoadModels: true,
      synchronize: false,
      models: [],
      logging: false,
    }),
    CardModule,
    AuthModule,
    UserModule,
    CommentaryModule,
    TagsModule,
    FirebaseModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
