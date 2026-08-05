import { Module } from '@nestjs/common';
import { DiscountPermissionsService } from './discount-permissions.service';
import { DiscountPermissionsController } from './discount-permissions.controller';

@Module({
  controllers: [DiscountPermissionsController],
  providers: [DiscountPermissionsService],
  exports: [DiscountPermissionsService],
})
export class DiscountPermissionsModule {}
