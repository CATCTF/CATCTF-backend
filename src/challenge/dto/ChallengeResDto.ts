import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Challenge } from '../challenge.entity';

export class ChallengesResDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsArray()
  challenges: Challenge[];

  @ApiProperty()
  @IsNumber()
  total: number;
}

export class ChallengeResDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  category: string;
}

export class CHallengeOneResDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  point: number;

  @ApiProperty()
  @IsArray()
  solves: {
    id: string;
    name: string;
    createdAt: Date;
  }[];
}