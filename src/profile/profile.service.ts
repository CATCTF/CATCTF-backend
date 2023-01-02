import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { sha256 } from 'src/auth/auth.service';
import { MessageResDto } from 'src/dto/MessageResDto';
import { getDynamicScore } from 'src/utils/getDynamicScore';
import { Repository } from 'typeorm';
import { ProfileDto, ProfileResDto } from './dto/ProfileDto';
import { User } from './user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async getProfile(id: string): Promise<ProfileResDto> {
    const profile = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .select(['user.id', 'user.name', 'user.school', 'user.isAdmin'])
      .leftJoin('user.solves', 'solve', 'solve.userId = user.id')
      .addSelect('solve.createdAt')
      .addSelect('solve.id')
      .leftJoin(
        'solve.challenge',
        'challenge',
        'challenge.id = solve.challengeId',
      )
      .addSelect('challenge.id')
      .addSelect('challenge.name')
      .addSelect('challenge.point')
      .leftJoinAndSelect(
        'challenge.solves',
        'solves',
        'solves.challengeId = challenge.id',
      )
      .getOne();
    const point = profile.solves.reduce((acc, cur) => {
      return acc + cur.challenge.point;
    }, 0);

    return {
      ...profile,
      point,
    };
  }

  async changeProfile(id: string, body: ProfileDto): Promise<MessageResDto> {
    const profile = await this.userRepository.findOneBy({ id });
    if (body.name) profile.name = body.name;
    if (body.password) {
      if (sha256(body.password) === profile.password)
        profile.password = sha256(body.newPassword);
      else throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }
    if (body.school) profile.school = body.school;
    await this.userRepository.save(profile);
    return { message: 'ok' };
  }
}
