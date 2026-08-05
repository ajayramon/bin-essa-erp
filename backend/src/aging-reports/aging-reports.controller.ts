import { Controller, Get, UseGuards } from '@nestjs/common';
import { AgingReportsService } from './aging-reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('aging-reports')
@UseGuards(JwtAuthGuard)
export class AgingReportsController {
  constructor(private readonly agingReportsService: AgingReportsService) {}

  @Get('customer-ar')
  getCustomerArAging() {
    return this.agingReportsService.getCustomerArAging();
  }

  @Get('supplier-ap')
  getSupplierApAging() {
    return this.agingReportsService.getSupplierApAging();
  }
}
