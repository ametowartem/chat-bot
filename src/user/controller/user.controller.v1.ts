import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PermissionService } from '../../permission/service/permission.service';
import { CreateUserRequestDto } from '../dto/create-user.request.dto';
import { UserService } from '../service/user.service';
import { GetUsersRequestDto } from '../dto/get-users.request.dto';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { PermissionHandler } from '../../permission/decorator/permission.decorator';
import { UserPermission } from '../../permission/const/permission.enum';
import { ChangeUserRequestDto } from '../dto/change-user.request.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../decorator/user-http.decorator';
import { UserEntity } from '../entity/user.entity';
import { DeleteUserRequestDto } from '../dto/delete-user.request.dto';

@Controller('v1/user')
export class UserControllerV1 {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly userService: UserService,
  ) {}

  @Post('registry')
  registry(@Body() dto: CreateUserRequestDto) {
    return this.userService.registry({
      firstName: dto.firstName,
      patronymic: dto.patronymic,
      lastName: dto.lastName,
      username: dto.username,
      password: dto.password,
    });
  }

  @ApiBearerAuth()
  @PermissionHandler(UserPermission.AllowGetUsers)
  @UseGuards(AuthGuard)
  @Post('users') // should use @Get, but it's harder to test with swagger
  async getUsersList(@Body() dto: GetUsersRequestDto) {
    return await this.userService.getUsersList({
      filters: dto.filters,
      sorting: dto.sorting,
      pagination: dto.pagination,
    });
  }

  @ApiBearerAuth()
  @PermissionHandler(UserPermission.AllowEditUsers)
  @UseGuards(AuthGuard)
  @Post('change')
  async changeUser(
    @Body() dto: ChangeUserRequestDto,
    @User() user: UserEntity,
  ) {
    await this.userService.changeUser(dto, user);
  }

  @ApiBearerAuth()
  @PermissionHandler(UserPermission.AllowDeleteUsers)
  @UseGuards(AuthGuard)
  @Post('delete')
  async deleteUser(
    @Body() dto: DeleteUserRequestDto,
    @User() user: UserEntity,
  ) {
    await this.userService.deleteUser(dto, user);
  }
}
