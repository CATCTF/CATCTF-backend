import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoticeDto } from './dto/NoticeDto';
import { Notice } from './notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  async getAll(): Promise<Notice[]> {
    return this.noticeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async create(notice: NoticeDto): Promise<Notice> {
    return this.noticeRepository.save(notice);
  }

  async delete(id: string) {
    await this.noticeRepository.delete(id);
    return { id };
  }
}
