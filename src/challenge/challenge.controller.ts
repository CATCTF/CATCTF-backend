import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AccessGuard, AdminGuard } from 'src/auth/guard/access.guard';
import { ChallengeService } from './challenge.service';
import {
  CHallengeOneResDto,
  ChallengeResDto,
  ChallengesResDto,
} from './dto/ChallengeResDto';
import { DeleteDto } from './dto/DeleteDto';
import { SolveDto, SolveResDto } from './dto/SolveDto';
import { UpdateDto } from './dto/UpdateDto';
import { UploadDto } from './dto/UploadDto';

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async getAll(@Req() req: any): Promise<ChallengesResDto> {
    return this.challengeService.getAll(req.user);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async upload(@Body() body: UploadDto): Promise<ChallengeResDto> {
    return this.challengeService.upload(body);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async delete(@Body() body: DeleteDto): Promise<DeleteDto> {
    return this.challengeService.delete(body);
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async update(@Body() body: UpdateDto): Promise<ChallengeResDto> {
    return this.challengeService.upload(body);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiQuery({ name: 'id', required: true })
  @UseGuards(AccessGuard)
  async getOne(@Query('id') id: string): Promise<CHallengeOneResDto> {
    return this.challengeService.getOne(id);
  }

  @Post('solve')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async solve(@Req() req: any, @Body() body: SolveDto): Promise<SolveResDto> {
    return this.challengeService.solve(body, req.user);
  }
}
