import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './userModule/user.module';
import { User } from './userModule/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_DB_URL || 'mongodb://localhost:27017/egtestdb',  // Use environment variables
      useUnifiedTopology: true,
      entities: [User],
      synchronize: true, // Be cautious about using synchronize in production
    } as TypeOrmModuleOptions),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  constructor(private readonly dataSource: DataSource) {}
}