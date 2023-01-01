import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './profile/user.entity';
import { Challenge } from './challenge/challenge.entity';
import { Solve } from './challenge/solve.entity';
import { File } from './challenge/file.entity';
import { Notice } from './notice/notice.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [User, Challenge, Solve, File, Notice],
        synchronize: true,
        charset: 'utf8_general_ci',
      }),
    }),
  ],
})
export class DataBaseModule {}
