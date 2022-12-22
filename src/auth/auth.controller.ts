import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
  async getHello(): Promise<string> {
    return await this.authService.getHello();
  }

  @Post('/register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() body: RegisterDto): Promise<AuthResDto> {
    return await this.authService.register(body);
  }

  @Post('/login')
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto): Promise<AuthResDto> {
    return await this.authService.login(body);
  }
}
