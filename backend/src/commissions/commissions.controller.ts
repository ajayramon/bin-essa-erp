import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommissionsService } from './commissions.service';
import { CreateSalesTargetDto } from './dto/create-sales-target.dto';
import { CreateCommissionRuleDto } from './dto/create-commission-rule.dto';

@Controller('commissions')
@UseGuards(JwtAuthGuard)
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Get('targets')
  findAllTargets(@Req() req: any, @Query('branchId') queryBranchId?: string) {
    const user = req?.user;
    const isGlobalRole = user?.role === 'ADMIN' || user?.role === 'ACCOUNTANT';
    const effectiveBranchId = !isGlobalRole && user?.branchId ? user.branchId : queryBranchId;
    return this.commissionsService.findAllTargets(effectiveBranchId);
  }

  @Post('targets')
  createTarget(@Body() dto: CreateSalesTargetDto) {
    return this.commissionsService.createTarget(dto);
  }

  @Get('rules')
  findAllRules() {
    return this.commissionsService.findAllRules();
  }

  @Post('rules')
  createRule(@Body() dto: CreateCommissionRuleDto) {
    return this.commissionsService.createRule(dto);
  }

  @Post('calculate/:userId')
  calculateCommission(
    @Param('userId') userId: string,
    @Body() body: { period: string; startDate: string; endDate: string },
  ) {
    return this.commissionsService.calculateUserCommission(
      userId,
      body.period,
      new Date(body.startDate),
      new Date(body.endDate),
    );
  }
}
