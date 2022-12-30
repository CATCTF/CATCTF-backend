import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessGuard } from 'src/auth/guard/access.guard';
import { User } from 'src/profile/user.entity';
import { ScoreService } from './score.service';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async getScore(): Promise<User[]> {
    return await this.scoreService.getScoreAll();
  }
}
