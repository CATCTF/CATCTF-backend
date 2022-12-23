import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProfileDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  password?: string;

  @ApiProperty()
  @IsString()
  newPassword?: string;

  @ApiProperty()
  @IsString()
  school?: string;
}

export class ProfileResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  school: string;

  @ApiProperty()
  point: number;

  @ApiProperty()
  solves: {
    challenge: {
      id: string;
      name: string;
      point: number;
    };
    createdAt: Date;
  }[];
}
