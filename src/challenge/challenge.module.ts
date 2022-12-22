import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/profile/user.entity';
import { ChallengeController } from './challenge.controller';
import { Challenge } from './challenge.entity';
import { ChallengeService } from './challenge.service';
import { Solve } from './solve.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge, User, Solve])],
  controllers: [ChallengeController],
  providers: [ChallengeService, ConfigService],
})
export class ChallengeModule {}
