import { Module } from '@nestjs/common';
import { TrialBalanceController } from './trial-balance.controller';
import { TrialBalanceService } from './trial-balance.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrialBalanceController],
  providers: [TrialBalanceService],
})
export class TrialBalanceModule {}
