import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VouchersService } from './vouchers.service';
import { CreateReceiptVoucherDto } from './dto/create-receipt-voucher.dto';
import { CreatePaymentVoucherDto } from './dto/create-payment-voucher.dto';

@Controller('vouchers')
@UseGuards(JwtAuthGuard)
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get('receipts')
  findAllReceipts(@Req() req: any, @Query('branchId') queryBranchId?: string) {
    const user = req?.user;
    const isGlobalRole = user?.role === 'ADMIN' || user?.role === 'ACCOUNTANT';
    const effectiveBranchId = !isGlobalRole && user?.branchId ? user.branchId : queryBranchId;
    return this.vouchersService.findAllReceiptVouchers(effectiveBranchId);
  }

  @Post('receipts')
  createReceipt(@Body() dto: CreateReceiptVoucherDto) {
    return this.vouchersService.createReceiptVoucher(dto);
  }

  @Get('payments')
  findAllPayments(@Req() req: any, @Query('branchId') queryBranchId?: string) {
    const user = req?.user;
    const isGlobalRole = user?.role === 'ADMIN' || user?.role === 'ACCOUNTANT';
    const effectiveBranchId = !isGlobalRole && user?.branchId ? user.branchId : queryBranchId;
    return this.vouchersService.findAllPaymentVouchers(effectiveBranchId);
  }

  @Post('payments')
  createPayment(@Body() dto: CreatePaymentVoucherDto) {
    return this.vouchersService.createPaymentVoucher(dto);
  }
}
