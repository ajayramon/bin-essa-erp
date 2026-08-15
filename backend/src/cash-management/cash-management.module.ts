import { Module } from '@nestjs/common';
import { CashManagementService } from './cash-management.service';
import { CashManagementController } from './cash-management.controller';

@Module({
  controllers: [CashManagementController],
  providers: [CashManagementService],
  exports: [CashManagementService],
})
export class CashManagementModule {}
