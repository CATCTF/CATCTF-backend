import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { MessageResDto } from 'src/dto/MessageResDto';

export class SolveDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  flag: string;
}

export class SolveResDto extends MessageResDto {
  @ApiProperty()
  @IsBoolean()
  correct: boolean;
}
