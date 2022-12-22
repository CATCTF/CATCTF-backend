
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MessageResDto {
  @ApiProperty()
  @IsString()
  message: string;
}
