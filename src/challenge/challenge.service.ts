import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { sha256 } from 'src/auth/auth.service';
import { User } from 'src/profile/user.entity';
import { Repository } from 'typeorm';
import { Challenge } from './challenge.entity';
import { ChallengeResDto, ChallengesResDto } from './dto/ChallengeResDto';
import { DeleteDto } from './dto/DeleteDto';
import { SolveDto, SolveResDto } from './dto/SolveDto';
import { UpdateDto } from './dto/UpdateDto';
import { UploadDto } from './dto/UploadDto';
import { Solve } from './solve.entity';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Solve)
    private readonly solveRepository: Repository<Solve>,
    private readonly config: ConfigService,
  ) {}

  async getAll(req: User): Promise<ChallengesResDto> {
    let challenges: Challenge[];
    if (req.isAdmin) challenges = await this.challengeRepository.find();
    else challenges = await this.challengeRepository.findBy({ show: true });
    return {
      userId: req.id,
      challenges,
      total: challenges.length,
    };
  }

  async getOne(id: string): Promise<Challenge> {
    if (!id) throw new HttpException('ID not found', HttpStatus.BAD_REQUEST);
    const challenge = await this.challengeRepository
      .createQueryBuilder('challenge')
      .where('challenge.id = :id', { id })
      .select(['challenge.id', 'challenge.name'])
      .leftJoin('challenge.solves', 'solve', 'solve.challengeId = challenge.id')
      .addSelect('solve.createdAt')
      .leftJoin('solve.user', 'user')
      .addSelect('user.id')
      .addSelect('user.name')
      .getOne();

    return challenge;
  }

  async upload(body: UploadDto): Promise<ChallengeResDto> {
    const challenge = await this.challengeRepository.create({
      ...body,
      flag: sha256(body.flag),
      point: this.config.get<number>('MAXIMUM_POINT'),
    });
    await this.challengeRepository.save(challenge);
    return {
      id: challenge.id,
      name: challenge.name,
      category: challenge.category,
    };
  }

  async delete(body: DeleteDto): Promise<DeleteDto> {
    const challenge = await this.challengeRepository.findOneBy({
      id: body.id,
    });

    if (!challenge)
      throw new HttpException('Challenge not found', HttpStatus.BAD_REQUEST);

    await this.challengeRepository.delete(challenge);
    await this.challengeRepository.save(challenge);

    return {
      id: challenge.id,
    };
  }

  async update(body: UpdateDto): Promise<ChallengeResDto> {
    const challenge = await this.challengeRepository.findOneBy({
      id: body.id,
    });

    if (!challenge)
      throw new HttpException('Challenge not found', HttpStatus.BAD_REQUEST);

    Object.assign(challenge, body);

    await this.challengeRepository.save(challenge);

    return {
      id: challenge.id,
      name: challenge.name,
      category: challenge.category,
    };
  }

  async solve(body: SolveDto, user: User): Promise<SolveResDto> {
    const isSolved = await this.solveRepository.findOneBy({
      user: {
        id: user.id,
      },
      challenge: {
        id: body.id,
      },
    });
    if (isSolved)
      throw new HttpException('Already solved', HttpStatus.BAD_REQUEST);

    const challenge = await this.challengeRepository.findOneBy({
      id: body.id,
    });
    const isCorrectFlag = sha256(body.flag) === challenge.flag;
    challenge.solve += 1;
    await this.challengeRepository.save(challenge);

    const solve = this.solveRepository.create({
      user: { id: user.id },
      challenge: { id: body.id },
    });
    await this.solveRepository.save(solve);

    return {
      message: isCorrectFlag ? 'Correct flag' : 'Incorrect flag',
      correct: isCorrectFlag,
    };
  }
}
