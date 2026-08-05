import { Module } from '@nestjs/common';
import { AgingReportsService } from './aging-reports.service';
import { AgingReportsController } from './aging-reports.controller';

@Module({
  controllers: [AgingReportsController],
  providers: [AgingReportsService],
  exports: [AgingReportsService],
})
export class AgingReportsModule {}
