import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PricingEngineService } from './pricing-engine.service';
import { EvaluatePriceDto } from './dto/evaluate-price.dto';

@Controller('pricing')
@UseGuards(JwtAuthGuard)
export class PricingEngineController {
  constructor(private readonly pricingService: PricingEngineService) {}

  @Post('evaluate')
  evaluatePrice(@Body() body: EvaluatePriceDto) {
    return this.pricingService.calculatePrice(body);
  }
}
