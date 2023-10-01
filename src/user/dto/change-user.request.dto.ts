import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserStatus } from '../const/user.status.enum';

export class ChangeUserRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  uuid: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // username?: string;
  //
  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  patronymic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  role?: string;
}
