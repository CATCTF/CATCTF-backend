import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AccessGuard } from 'src/auth/guard/access.guard';
import { MessageResDto } from 'src/dto/MessageResDto';
import { ProfileDto } from './dto/ProfileDto';
import { ProfileService } from './profile.service';
import { User } from './user.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async getProfile(@Req() req: any): Promise<any> {
    return this.profileService.getProfile(req.user.id);
  }

  @Get(':id')
  @ApiQuery({ name: 'id', required: true })
  @ApiBearerAuth()
  async getProfileById(@Query('id') id: string): Promise<User> {
    return this.profileService.getProfile(id);
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async changeProfile(
    @Req() req: any,
    @Body() body: ProfileDto,
  ): Promise<MessageResDto> {
    return this.profileService.changeProfile(req.user.id, body);
  }
}
