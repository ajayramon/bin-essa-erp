import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BankManagementService } from './bank-management.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { CreateBankTransactionDto } from './dto/create-bank-transaction.dto';
import { CreateBankReconciliationDto } from './dto/create-bank-reconciliation.dto';

@Controller('banks')
@UseGuards(JwtAuthGuard)
export class BankManagementController {
  constructor(private readonly bankService: BankManagementService) {}

  @Get('accounts')
  findAllAccounts() {
    return this.bankService.findAllAccounts();
  }

  @Get('accounts/:id')
  findOneAccount(@Param('id') id: string) {
    return this.bankService.findOneAccount(id);
  }

  @Post('accounts')
  createAccount(@Body() dto: CreateBankAccountDto) {
    return this.bankService.createAccount(dto);
  }

  @Post('transactions')
  createTransaction(@Body() dto: CreateBankTransactionDto) {
    return this.bankService.createTransaction(dto);
  }

  @Post('reconciliations')
  createReconciliation(@Body() dto: CreateBankReconciliationDto) {
    return this.bankService.createReconciliation(dto);
  }
}
