import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoyaltyService } from './loyalty.service';
import { UpdateLoyaltyProgramDto } from './dto/update-loyalty-program.dto';
import { CreateLoyaltyTransactionDto } from './dto/create-loyalty-transaction.dto';

@Controller('loyalty')
@UseGuards(JwtAuthGuard)
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('program')
  getProgram() {
    return this.loyaltyService.getProgram();
  }

  @Put('program')
  updateProgram(@Body() dto: UpdateLoyaltyProgramDto) {
    return this.loyaltyService.updateProgram(dto);
  }

  @Get('customers/:customerId')
  getCustomerAccount(@Param('customerId') customerId: string) {
    return this.loyaltyService.getCustomerAccount(customerId);
  }

  @Post('transactions')
  recordTransaction(@Body() dto: CreateLoyaltyTransactionDto) {
    return this.loyaltyService.recordTransaction(dto);
  }
}
