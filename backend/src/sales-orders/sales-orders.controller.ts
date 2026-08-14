import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SalesOrdersService } from './sales-orders.service';
import { CreateSalesOrderDto } from './dto/create-sales-order.dto';

@UseGuards(JwtAuthGuard)
@Controller('sales-orders')
export class SalesOrdersController {
  constructor(private readonly salesOrdersService: SalesOrdersService) {}

  @Post()
  create(@Body() createSalesOrderDto: CreateSalesOrderDto) {
    return this.salesOrdersService.create(createSalesOrderDto);
  }

  @Get()
  findAll(@Req() req: any, @Query('branchId') queryBranchId?: string) {
    const user = req?.user;
    const isGlobalRole = user?.role === 'ADMIN' || user?.role === 'ACCOUNTANT';
    const effectiveBranchId = !isGlobalRole && user?.branchId ? user.branchId : queryBranchId;
    return this.salesOrdersService.findAll(effectiveBranchId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesOrdersService.findOne(id);
  }
}
