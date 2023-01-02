import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AccessGuard } from 'src/auth/guard/access.guard';
import { MessageResDto } from 'src/dto/MessageResDto';
import { ProfileDto, ProfileResDto } from './dto/ProfileDto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async getProfile(@Req() req: any): Promise<any> {
    return await this.profileService.getProfile(req.user.id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth()
  async getProfileById(@Param('id') id: string): Promise<ProfileResDto> {
    return await this.profileService.getProfile(id);
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
