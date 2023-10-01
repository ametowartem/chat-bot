import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderDirection } from '../const/order-direction.enum';
import { UserStatus } from '../const/user.status.enum';
import { Type } from 'class-transformer';

class UsersFiltersRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: UserStatus, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(UserStatus, { each: true })
  statuses?: UserStatus[];

  @ApiPropertyOptional({})
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  userUuids?: string[];
}

class UsersSortingRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  field?: string;

  @ApiPropertyOptional()
  @IsEnum(OrderDirection)
  @IsOptional()
  direction?: OrderDirection;
}

class UsersPaginationRequestDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class GetUsersRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => UsersFiltersRequestDto)
  @ValidateNested()
  filters?: UsersFiltersRequestDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => UsersSortingRequestDto)
  @ValidateNested()
  sorting?: UsersSortingRequestDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => UsersPaginationRequestDto)
  @ValidateNested()
  pagination?: UsersPaginationRequestDto;
}
