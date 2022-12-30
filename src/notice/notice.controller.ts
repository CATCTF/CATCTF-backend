import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessGuard, AdminGuard } from 'src/auth/guard/access.guard';
import { NoticeDto } from './dto/NoticeDto';
import { Notice } from './notice.entity';
import { NoticeService } from './notice.service';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  async getAll(): Promise<Notice[]> {
    return this.noticeService.getAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async create(@Body() body: NoticeDto): Promise<Notice> {
    return this.noticeService.create(body);
  }

  @Delete()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async delete(@Body() id: string) {
    return this.noticeService.delete(id);
  }
}
