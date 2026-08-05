import { Module } from '@nestjs/common';
import { PdcChecksService } from './pdc-checks.service';
import { PdcChecksController } from './pdc-checks.controller';

@Module({
  controllers: [PdcChecksController],
  providers: [PdcChecksService],
  exports: [PdcChecksService],
})
export class PdcChecksModule {}
