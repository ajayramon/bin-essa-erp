import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CustomerPaymentsService } from './customer-payments.service';
import { CreateCustomerPaymentDto } from './dto/create-customer-payment.dto';

@Controller('customer-payments')
export class CustomerPaymentsController {
  constructor(private readonly customerPaymentsService: CustomerPaymentsService) {}

  @Post()
  create(@Body() createCustomerPaymentDto: CreateCustomerPaymentDto) {
    return this.customerPaymentsService.create(createCustomerPaymentDto);
  }

  @Get()
  findAll() {
    return this.customerPaymentsService.findAll();
  }

  @Get('statement/:customerId')
  getStatement(@Param('customerId') customerId: string) {
    return this.customerPaymentsService.getStatementOfAccount(customerId);
  }
}
