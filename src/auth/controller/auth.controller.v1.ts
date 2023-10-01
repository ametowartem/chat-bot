import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SingInResponseDto } from '../dto/sign-in.response.dto';
import { SingInRequestDto } from '../dto/sign-in.request.dto';
import { UserPayloadDto } from '../dto/user-payload.dto';
import { AuthGuard } from '../guard/auth.guard';
import { PermissionHandler } from '../../permission/decorator/permission.decorator';
import { UserPermission } from '../../permission/const/permission.enum';

@Controller('v1/auth')
export class AuthControllerV1 {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    type: SingInResponseDto,
    status: HttpStatus.OK,
  })
  @Post('/')
  signIn(@Body() body: SingInRequestDto) {
    return this.authService.signIn(body.username, body.password);
  }

  @ApiBearerAuth()
  @PermissionHandler(UserPermission.AllowGetUserProfile)
  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiResponse({
    type: UserPayloadDto,
    status: HttpStatus.OK,
  })
  async getProfile(@Request() req): Promise<UserPayloadDto> {
    return new UserPayloadDto({
      uuid: req.user.uuid,
      username: req.user.username,
      role: req.user.role.code,
    });
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('logout')
  async logout(@Request() req) {
    const payload = req.user;
    await this.authService.logout(payload);
  }
}
