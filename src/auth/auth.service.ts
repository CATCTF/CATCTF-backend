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

export function sha256(text: string) {
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

  async generateAccessToken(id: string): Promise<AuthResDto> {
    const accessToken = await this.jwtService.signAsync(
      { id },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN') ?? '1d',
      },
    );
    return { accessToken };
  }

  async getHello(isAdmin: boolean): Promise<{ isAdmin: boolean }> {
    return { isAdmin };
  }

  async register(body: RegisterDto): Promise<{ id: string }> {
    const user = await this.userRepository.findOne({
      where: { id: body.id },
    });

    if (user) throw new HttpException('Already exists', HttpStatus.BAD_REQUEST);

    const newUser = this.userRepository.create({
      ...body,
      password: sha256(body.password),
    });
    await this.userRepository.save(newUser);

    return { id: newUser.id };
  }

  async login(body: LoginDto): Promise<{ id: string }> {
    const { id, password } = body;
    const user = await this.userRepository.findOneBy({
      id,
      password: sha256(password),
    });

    if (!user) throw new HttpException('Forbbiden', HttpStatus.UNAUTHORIZED);

    return { id };
  }
}
