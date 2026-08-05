import { Module } from '@nestjs/common';
import { PosShiftsService } from './pos-shifts.service';
import { PosShiftsController } from './pos-shifts.controller';

@Module({
  controllers: [PosShiftsController],
  providers: [PosShiftsService],
  exports: [PosShiftsService],
})
export class PosShiftsModule {}
