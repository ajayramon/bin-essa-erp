import { Controller, Get, Put, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DiscountPermissionsService } from './discount-permissions.service';
import { UpdateDiscountPermissionDto, VerifyManagerPinDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('discount-permissions')
@UseGuards(JwtAuthGuard)
export class DiscountPermissionsController {
  constructor(private readonly service: DiscountPermissionsService) {}

  @Get()
  getAllPermissions() {
    return this.service.getAllPermissions();
  }

  @Get('user/:userId')
  getUserPermission(@Param('userId') userId: string) {
    return this.service.getUserPermission(userId);
  }

  @Put('user/:userId')
  updatePermission(@Param('userId') userId: string, @Body() dto: UpdateDiscountPermissionDto) {
    return this.service.updatePermission(userId, dto);
  }

  @Post('verify-manager-pin')
  verifyManagerPin(@Body() dto: VerifyManagerPinDto) {
    return this.service.verifyManagerPin(dto);
  }
}
