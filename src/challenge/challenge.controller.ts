import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { AccessGuard, AdminGuard } from 'src/auth/guard/access.guard';
import { Challenge } from './challenge.entity';
import { ChallengeService } from './challenge.service';
import { ChallengeResDto, ChallengesResDto } from './dto/ChallengeResDto';
import { DeleteDto } from './dto/DeleteDto';
import { SolveDto, SolveResDto } from './dto/SolveDto';
import { UpdateDto } from './dto/UpdateDto';
import { UploadDto, UploadFileDto, UploadFileResDto } from './dto/UploadDto';

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

  @Post('file')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @Body() body: UploadFileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1e8 }), // 100MB
        ],
      }),
    )
    challengeFile: Express.Multer.File,
  ): Promise<UploadFileResDto> {
    return this.challengeService.uploadFile(body, challengeFile);
  }

  @Get('/file/:id')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async downloadFile(@Query('id') id: string) {
    return this.challengeService.downloadFile(id);
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
    return this.challengeService.update(body);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiQuery({ name: 'id', required: true })
  @UseGuards(AccessGuard)
  async getOne(@Query('id') id: string): Promise<Challenge> {
    return this.challengeService.getOne(id);
  }

  @Post('solve')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async solve(@Req() req: any, @Body() body: SolveDto): Promise<SolveResDto> {
    return this.challengeService.solve(body, req.user);
  }
}
