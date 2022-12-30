import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AccessGuard } from 'src/auth/guard/access.guard';
import { RegisterDto } from './dto/RegisterDto';
import { LoginDto } from './dto/LoginDto';
import { AuthResDto } from './dto/AuthResDto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async getHello(@Req() req: any) {
    return this.authService.getHello(req.user.isAdmin);
  }

  @Post('/register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() body: RegisterDto): Promise<AuthResDto> {
    const { id } = await this.authService.register(body);
    const { accessToken } = await this.authService.generateAccessToken(id);
    return { accessToken };
  }

  @Post('/login')
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto): Promise<AuthResDto> {
    const { id } = await this.authService.login(body);
    const { accessToken } = await this.authService.generateAccessToken(id);
    return { accessToken };
  }
}
