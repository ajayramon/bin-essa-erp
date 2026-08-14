import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomerPaymentsService } from './customer-payments.service';
import { CreateCustomerPaymentDto } from './dto/create-customer-payment.dto';

@UseGuards(JwtAuthGuard)
@Controller('customer-payments')
export class CustomerPaymentsController {
  constructor(private readonly customerPaymentsService: CustomerPaymentsService) {}

  @Post()
  create(@Body() createCustomerPaymentDto: CreateCustomerPaymentDto) {
    return this.customerPaymentsService.create(createCustomerPaymentDto);
  }

  @Get()
  findAll(@Req() req: any, @Query('branchId') queryBranchId?: string) {
    const user = req?.user;
    const isGlobalRole = user?.role === 'ADMIN' || user?.role === 'ACCOUNTANT';
    const effectiveBranchId = !isGlobalRole && user?.branchId ? user.branchId : queryBranchId;
    return this.customerPaymentsService.findAll(effectiveBranchId);
  }

  @Get('statement/:customerId')
  getStatement(@Param('customerId') customerId: string) {
    return this.customerPaymentsService.getStatementOfAccount(customerId);
  }
}
