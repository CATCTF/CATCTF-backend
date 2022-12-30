import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  flag: string;

  @ApiProperty()
  @IsString()
  connection?: string;

  @ApiProperty()
  @IsString()
  hint?: string;
}

export class UploadFileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty()
  file: Express.Multer.File;
}

export class UploadFileResDto {
  @ApiProperty()
  @IsString()
  file: string;

  @ApiProperty()
  @IsString()
  challenge: string;
}
