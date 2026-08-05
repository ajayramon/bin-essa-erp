import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PdcChecksService } from './pdc-checks.service';
import { CreatePdcCheckDto } from './dto/create-pdc-check.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pdc-checks')
@UseGuards(JwtAuthGuard)
export class PdcChecksController {
  constructor(private readonly pdcChecksService: PdcChecksService) {}

  @Get()
  findAll() {
    return this.pdcChecksService.findAll();
  }

  @Post()
  create(@Body() dto: CreatePdcCheckDto) {
    return this.pdcChecksService.create(dto);
  }

  @Put(':id/deposit')
  deposit(@Param('id') id: string) {
    return this.pdcChecksService.deposit(id);
  }

  @Put(':id/clear')
  clear(@Param('id') id: string) {
    return this.pdcChecksService.clear(id);
  }

  @Put(':id/bounce')
  bounce(@Param('id') id: string) {
    return this.pdcChecksService.bounce(id);
  }
}
