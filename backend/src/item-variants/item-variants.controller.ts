import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ItemVariantsService } from './item-variants.service';
import { CreateItemVariantDto } from './dto/create-item-variant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('item-variants')
@UseGuards(JwtAuthGuard)
export class ItemVariantsController {
  constructor(private readonly itemVariantsService: ItemVariantsService) {}

  @Get('item/:itemId')
  findByItem(@Param('itemId') itemId: string) {
    return this.itemVariantsService.findByItem(itemId);
  }

  @Post()
  create(@Body() dto: CreateItemVariantDto) {
    return this.itemVariantsService.create(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.itemVariantsService.delete(id);
  }
}
