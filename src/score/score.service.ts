import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/profile/user.entity';
import { Repository } from 'typeorm';

export function removeAdmin(users: User[]) {
  users.forEach((user, index) => {
    if (user.isAdmin) users.splice(index, 1);
  });
  return users;
}

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getScoreAll(): Promise<User[]> {
    const scoreboard: User[] = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.solves', 'solve', 'solve.userId = user.id')
      .leftJoin('solve.challenge', 'challenge')
      .where('user.isAdmin = false')
      .select('user.id', 'id')
      .addSelect('user.name', 'name')
      .addSelect('MIN(solve.createdAt)', 'lastSolvedAt')
      .addSelect('SUM(challenge.point)', 'point')
      .addSelect('COUNT(solve.id)', 'solved')
      .orderBy('point', 'DESC')
      .addOrderBy('lastSolvedAt', 'ASC')
      .groupBy('user.id')
      .getRawMany();
    return scoreboard;
  }
}
