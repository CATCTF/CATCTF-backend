import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/profile/user.entity';
import { ChallengeController } from './challenge.controller';
import { Challenge } from './challenge.entity';
import { ChallengeService } from './challenge.service';
import { Solve } from './solve.entity';
import { File } from './file.entity';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forFeature([Challenge, User, Solve, File]),
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService, ConfigService],
})
export class ChallengeModule {}
