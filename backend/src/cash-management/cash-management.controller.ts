import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CashManagementService } from './cash-management.service';
import { CreateCashAccountDto } from './dto/create-cash-account.dto';
import { CreateCashTransferDto } from './dto/create-cash-transfer.dto';

@Controller('cash')
@UseGuards(JwtAuthGuard)
export class CashManagementController {
  constructor(private readonly cashService: CashManagementService) {}

  @Get('accounts')
  findAllAccounts(@Req() req: any, @Query('branchId') queryBranchId?: string) {
    const user = req?.user;
    const isGlobalRole = user?.role === 'ADMIN' || user?.role === 'ACCOUNTANT';
    const effectiveBranchId = !isGlobalRole && user?.branchId ? user.branchId : queryBranchId;
    return this.cashService.findAllAccounts(effectiveBranchId);
  }

  @Post('accounts')
  createAccount(@Body() dto: CreateCashAccountDto) {
    return this.cashService.createAccount(dto);
  }

  @Get('transfers')
  findAllTransfers(@Req() req: any, @Query('branchId') queryBranchId?: string) {
    const user = req?.user;
    const isGlobalRole = user?.role === 'ADMIN' || user?.role === 'ACCOUNTANT';
    const effectiveBranchId = !isGlobalRole && user?.branchId ? user.branchId : queryBranchId;
    return this.cashService.findAllTransfers(effectiveBranchId);
  }

  @Post('transfers')
  createTransfer(@Body() dto: CreateCashTransferDto) {
    return this.cashService.createTransfer(dto);
  }
}
