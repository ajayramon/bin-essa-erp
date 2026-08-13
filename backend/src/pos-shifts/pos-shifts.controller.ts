import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PosShiftsService } from './pos-shifts.service';
import { OpenPosShiftDto } from './dto/create-pos-shift.dto';
import { ClosePosShiftDto } from './dto/close-pos-shift.dto';
import { ReopenPosShiftDto } from './dto/reopen-pos-shift.dto';
import { AdjustPosShiftDto } from './dto/adjust-pos-shift.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pos-shifts')
@UseGuards(JwtAuthGuard)
export class PosShiftsController {
  constructor(private readonly posShiftsService: PosShiftsService) {}

  @Get('current')
  getCurrentShift(
    @Query('userId') userId?: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.posShiftsService.getCurrentShift(userId, branchId);
  }

  @Get()
  findAllShifts(@Query('branchId') branchId?: string) {
    return this.posShiftsService.findAllShifts(branchId);
  }

  @Post('open')
  openShift(@Body() dto: OpenPosShiftDto) {
    return this.posShiftsService.openShift(dto);
  }

  @Put(':id/close')
  closeShift(@Param('id') id: string, @Body() dto: ClosePosShiftDto) {
    return this.posShiftsService.closeShift(id, dto);
  }

  @Put(':id/reopen')
  reopenShift(@Param('id') id: string, @Body() dto: ReopenPosShiftDto) {
    return this.posShiftsService.reopenShift(id, dto);
  }

  @Put(':id/adjust')
  adjustShift(@Param('id') id: string, @Body() dto: AdjustPosShiftDto) {
    return this.posShiftsService.adjustShift(id, dto);
  }
}
