import { Module } from '@nestjs/common';
import { BankManagementService } from './bank-management.service';
import { BankManagementController } from './bank-management.controller';

@Module({
  controllers: [BankManagementController],
  providers: [BankManagementService],
  exports: [BankManagementService],
})
export class BankManagementModule {}
