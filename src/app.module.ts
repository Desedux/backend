import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardModule } from './card/card.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommentaryModule } from './commentary/commentary.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    CardModule,
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
    CategoryModule,
    AuthModule,
    UserModule,
    CommentaryModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
