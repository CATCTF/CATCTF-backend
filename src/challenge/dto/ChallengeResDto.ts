import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Challenge } from '../challenge.entity';

export class ChallengesResDto {
  @ApiProperty()
  @IsArray()
  challenges: Challenge[];

  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsArray()
  categories: string[];

  @ApiProperty()
  @IsArray()
  solves: string[];
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
