import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/profile/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/RegisterDto';
import * as crypto from 'crypto';
import { AuthResDto } from './dto/AuthResDto';
import { LoginDto } from './dto/LoginDto';

function sha256(text: string) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  async register(body: RegisterDto): Promise<AuthResDto> {
    const { id, name, email, password, school } = body;
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (user) throw new HttpException('Already exists', HttpStatus.BAD_REQUEST);

    const newUser = await this.userRepository.create({
      id,
      name,
      email,
      password: sha256(password),
      school,
    });
    await this.userRepository.save(newUser);

    const accessToken = await this.jwtService.signAsync(
      { id },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      },
    );

    return { accessToken };
  }

  async login(body: LoginDto): Promise<AuthResDto> {
    const { id, password } = body;
    const user = await this.userRepository.findOneBy({ id, password });

    if (!user)
      throw new HttpException('User Not Found', HttpStatus.UNAUTHORIZED);

    const accessToken = await this.jwtService.signAsync(
      { id },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      },
    );

    return { accessToken };
  }
}
