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
    private readonly configService: ConfigService,
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
      point: 500,
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
    const challenge = await this.challengeRepository.findOneBy({
      id: body.id,
    });

    if (!challenge)
      throw new HttpException('Challenge not found', HttpStatus.BAD_REQUEST);

    // if (!challenge.show) {
    //   throw new HttpException(
    //     'This challenge is not available',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    const isSolved = await this.solveRepository.findBy({
      challenge: { id: body.id },
    });

    if (isSolved.find((solve) => solve.user.id === user.id))
      throw new HttpException(
        'You have already solved this challenge',
        HttpStatus.BAD_REQUEST,
      );

    const isCorrectFlag = sha256(body.flag) === challenge.flag;

    if (isCorrectFlag) {
      const minimumPoint =
        this.configService.get<number>('MINIMUM_POINT') | 100;
      const maximumPoint =
        this.configService.get<number>('MAXIMUM_POINT') | 500;
      const decay = this.configService.get<number>('DECAY') | 15;

      const solve = this.solveRepository.create({
        user: { id: user.id },
        challenge: { id: challenge.id },
      });
      await this.solveRepository.save(solve);

      if (isSolved) {
        isSolved.forEach((solve) => {
          if (solve.user.id !== user.id) solve.user.point -= challenge.point;
        });
      }

      // Dynamic Scoring
      const point = Math.ceil(
        ((minimumPoint - maximumPoint) / decay ** 2) * challenge.solve ** 2 +
          maximumPoint,
      );

      challenge.point = point > 100 ? point : 100;

      const userData = await this.userRepository.findOneBy({
        id: user.id,
      });
      userData.point += challenge.point;
      await this.userRepository.save(userData);

      challenge.solve += 1;

      if (isSolved) {
        isSolved.forEach((solve) => {
          solve.user.point += challenge.point;
        });
      }

      await this.solveRepository.save(isSolved);
      await this.challengeRepository.save(challenge);
    }

    return {
      message: isCorrectFlag ? 'Correct flag' : 'Incorrect flag',
      correct: isCorrectFlag,
    };
  }
}
