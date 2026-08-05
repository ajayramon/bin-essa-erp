import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { SalesInvoicesService } from './sales-invoices.service';
import { CreateSalesInvoiceDto } from './dto/create-sales-invoice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sales-invoices')
@UseGuards(JwtAuthGuard)
export class SalesInvoicesController {
  constructor(private readonly salesInvoicesService: SalesInvoicesService) {}

  @Post()
  create(@Body() dto: CreateSalesInvoiceDto) {
    return this.salesInvoicesService.create(dto);
  }

  @Post('returns')
  createReturn(@Body() dto: CreateSalesInvoiceDto) {
    return this.salesInvoicesService.createReturn(dto);
  }

  @Get()
  findAll() {
    return this.salesInvoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesInvoicesService.findOne(id);
  }
}

