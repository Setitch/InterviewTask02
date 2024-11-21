import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ToInteger } from '../../shared/decorators/to-integer.transformer.decorator';

export class FetchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency: string;
  
  @ToInteger()
  @ApiProperty()
  @IsInt()
  @IsOptional()
  startTime: number;
  
  @ToInteger()
  @ApiProperty()
  @IsInt()
  @IsOptional()
  endTime: number;
  
  // TODO: add own validator for startTime be smaller than endTime
}
