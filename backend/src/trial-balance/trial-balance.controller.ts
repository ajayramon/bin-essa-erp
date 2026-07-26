import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TrialBalanceService } from './trial-balance.service';

@UseGuards(JwtAuthGuard)
@Controller('trial-balance')
export class TrialBalanceController {
  constructor(private trialBalanceService: TrialBalanceService) {}

  @Get()
  getTrialBalance() {
    return this.trialBalanceService.getTrialBalance();
  }
}