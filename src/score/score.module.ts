import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/profile/user.entity';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ScoreController],
  providers: [ScoreService],
})
export class ScoreModule {}
