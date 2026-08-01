import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { PurchaseInvoicesService } from './purchase-invoices.service';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('purchase-invoices')
@UseGuards(JwtAuthGuard)
export class PurchaseInvoicesController {
  constructor(private readonly purchaseInvoicesService: PurchaseInvoicesService) {}

  @Post()
  create(@Body() dto: CreatePurchaseInvoiceDto) {
    return this.purchaseInvoicesService.create(dto);
  }

  @Get()
  findAll() {
    return this.purchaseInvoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseInvoicesService.findOne(id);
  }
}
