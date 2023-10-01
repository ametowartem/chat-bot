import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserPayloadDto {
  constructor(data: Required<UserPayloadDto>) {
    Object.assign(this, data);
  }

  @ApiProperty({
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 2,
  })
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({
    example: 'user',
  })
  @IsString()
  @IsNotEmpty()
  role: string;
}
