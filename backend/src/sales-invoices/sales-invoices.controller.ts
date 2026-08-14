import { Controller, Post, Get, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
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
  findAll(@Req() req: any, @Query('branchId') queryBranchId?: string) {
    const user = req?.user;
    const isGlobalRole = user?.role === 'ADMIN' || user?.role === 'ACCOUNTANT';
    const effectiveBranchId = !isGlobalRole && user?.branchId ? user.branchId : queryBranchId;
    return this.salesInvoicesService.findAll(effectiveBranchId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesInvoicesService.findOne(id);
  }
}

