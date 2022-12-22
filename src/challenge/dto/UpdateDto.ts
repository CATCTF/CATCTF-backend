import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { UploadDto } from './UploadDto';

export class UpdateDto extends UploadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  show: boolean;
}
