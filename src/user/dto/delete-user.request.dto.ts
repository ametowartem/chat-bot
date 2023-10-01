import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteUserRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  userUuid: string;
}
