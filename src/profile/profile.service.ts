import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sha256 } from 'src/auth/auth.service';
import { MessageResDto } from 'src/dto/MessageResDto';
import { Repository } from 'typeorm';
import { ProfileDto } from './dto/ProfileDto';
import { User } from './user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(id: string): Promise<User> {
    const profile = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .select(['user.id', 'user.name', 'user.point', 'user.school'])
      .leftJoin('user.solves', 'solve', 'solve.userId = user.id')
      .addSelect('solve.createdAt')
      .leftJoin(
        'solve.challenge',
        'challenge',
        'challenge.id = solve.challengeId',
      )
      .addSelect('challenge.id')
      .addSelect('challenge.name')
      .addSelect('challenge.point')
      .getOne();

    return profile;
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
