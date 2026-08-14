import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StockTransfersService } from './stock-transfers.service';
import { CreateStockTransferDto } from './dto/create-stock-transfer.dto';

@UseGuards(JwtAuthGuard)
@Controller('stock-transfers')
export class StockTransfersController {
  constructor(private readonly stockTransfersService: StockTransfersService) {}

  @Post()
  create(@Body() createStockTransferDto: CreateStockTransferDto) {
    return this.stockTransfersService.create(createStockTransferDto);
  }

  @Get()
  findAll(@Req() req: any, @Query('branchId') queryBranchId?: string) {
    const user = req?.user;
    const isGlobalRole = user?.role === 'ADMIN' || user?.role === 'ACCOUNTANT';
    const effectiveBranchId = !isGlobalRole && user?.branchId ? user.branchId : queryBranchId;
    return this.stockTransfersService.findAll(effectiveBranchId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockTransfersService.findOne(id);
  }
}
