import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, rename } from 'fs';
import { join } from 'path';
import { sha256 } from 'src/auth/auth.service';
import { User } from 'src/profile/user.entity';
import { getDynamicScore } from 'src/utils/getDynamicScore';
import { Repository } from 'typeorm';
import { Challenge } from './challenge.entity';
import { ChallengeResDto, ChallengesResDto } from './dto/ChallengeResDto';
import { DeleteDto } from './dto/DeleteDto';
import { SolveDto, SolveResDto } from './dto/SolveDto';
import { UpdateDto } from './dto/UpdateDto';
import { UploadDto, UploadFileDto, UploadFileResDto } from './dto/UploadDto';
import { File } from './file.entity';
import { Solve } from './solve.entity';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Solve)
    private readonly solveRepository: Repository<Solve>,
    private readonly config: ConfigService,
  ) {}

  async getAll(req: User): Promise<ChallengesResDto> {
    let challenges: Challenge[];
    if (req.isAdmin)
      challenges = await this.challengeRepository
        .createQueryBuilder('challenge')
        .select([
          'challenge.id',
          'challenge.name',
          'challenge.description',
          'challenge.connection',
          'challenge.show',
          'challenge.point',
          'challenge.category',
        ])
        .leftJoin('challenge.file', 'file', 'file.challengeId = challenge.id')
        .addSelect('file.id')
        .addSelect('file.mimetype')
        .getMany();
    else
      challenges = await this.challengeRepository
        .createQueryBuilder('challenge')
        .where('challenge.show = true')
        .select([
          'challenge.id',
          'challenge.name',
          'challenge.description',
          'challenge.connection',
          'challenge.show',
          'challenge.point',
          'challenge.category',
        ])
        .leftJoin('challenge.file', 'file', 'file.challengeId = challenge.id')
        .addSelect('file.id')
        .addSelect('file.mimetype')
        .getMany();

    const solves = await this.solveRepository
      .createQueryBuilder('solve')
      .where('solve.userId = :userId', { userId: req.id })
      .leftJoinAndSelect('solve.challenge', 'challenge')
      .getMany();

    return {
      challenges,
      total: challenges.length,
      categories: [...new Set(challenges.map((c) => c.category))],
      solves: solves.map((s) => s.challenge.id),
    };
  }

  async getOne(id: string): Promise<Challenge> {
    if (!id) throw new HttpException('ID not found', HttpStatus.BAD_REQUEST);
    const challenge = await this.challengeRepository
      .createQueryBuilder('challenge')
      .where('challenge.id = :id', { id })
      .select(['challenge.id', 'challenge.name'])
      .leftJoin('challenge.solves', 'solve', 'solve.challengeId = challenge.id')
      .leftJoin('challenge.file', 'file', 'file.challengeId = challenge.id')
      .leftJoin('solve.user', 'user')
      .addSelect('solve.createdAt')
      .addSelect('user.id')
      .addSelect('user.name')
      .addSelect('file.id')
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

  async downloadFile(id: string) {
    const file = await this.fileRepository.findOneBy({
      id,
    });

    if (!file)
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
    return file.path;
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

    if (body.flag) body.flag = sha256(body.flag);
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
    if (!challenge)
      throw new HttpException('Challenge not found', HttpStatus.BAD_REQUEST);
    else if (!challenge.show)
      throw new HttpException('Challenge not found', HttpStatus.BAD_REQUEST);
    else if (user.isAdmin)
      throw new HttpException('Admin cannot solve', HttpStatus.BAD_REQUEST);
    const isCorrectFlag = sha256(body.flag) === challenge.flag;
    challenge.solve += 1;
    const maximumPoint = this.config.get<number>('MAXIMUM_POINT');
    const minimumPoint = this.config.get<number>('MINIMUM_POINT');
    const decay = this.config.get<number>('DECAY');
    getDynamicScore({
      solve_count: challenge.solve,
      maximumPoint,
      minimumPoint,
      decay,
    });
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

  async uploadFile(
    body: UploadFileDto,
    challengeFile: Express.Multer.File,
  ): Promise<UploadFileResDto> {
    const challenge = await this.challengeRepository.findOneBy({
      id: body.id,
    });

    const originalFile = await this.fileRepository.findOneBy({
      challenge: {
        id: body.id,
      },
    });
    if (originalFile) {
      challenge.file = null;
      await this.challengeRepository.save(challenge);
      await this.fileRepository.delete(originalFile);
      await this.fileRepository.save(originalFile);
    }

    const file = this.fileRepository.create({
      challenge: { id: body.id },
      name: challengeFile.originalname,
      path:
        challengeFile.path +
        '.' +
        challengeFile.originalname.split('.').reverse()[0],
      mimetype: challengeFile.mimetype,
    });
    await this.fileRepository.save(file);

    rename(
      challengeFile.path,
      challengeFile.path +
        '.' +
        challengeFile.originalname.split('.').reverse()[0],
      (err) => {
        if (err) throw err;
      },
    );

    challenge.file = file;
    await this.challengeRepository.save(challenge);

    if (!challenge)
      throw new HttpException('Challenge not found', HttpStatus.BAD_REQUEST);

    return {
      file: challengeFile.originalname,
      challenge: challenge.name,
    };
  }
}
