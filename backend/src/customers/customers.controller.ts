import { Controller, Post, Get, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @Get()
  findAll(@Req() req: any, @Query('branchId') queryBranchId?: string) {
    const user = req?.user;
    const isGlobalRole = user?.role === 'ADMIN' || user?.role === 'ACCOUNTANT';
    const effectiveBranchId = !isGlobalRole && user?.branchId ? user.branchId : queryBranchId;
    return this.customersService.findAll(effectiveBranchId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }
}
