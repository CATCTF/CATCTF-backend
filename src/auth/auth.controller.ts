import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AccessGuard } from 'src/auth/guard/access.guard';
import { RegisterDto } from './dto/RegisterDto';
import { LoginDto } from './dto/LoginDto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async getHello() {
    return await this.authService.getHello();
  }

  @Post('/register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('/login')
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }
}
