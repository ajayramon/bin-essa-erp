import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SaveInventoryCategoryDto } from './dto/save-inventory-category.dto';
import { InventoryCategoriesService } from './inventory-categories.service';

@Controller('inventory-categories')
@UseGuards(JwtAuthGuard)
export class InventoryCategoriesController {
  constructor(private readonly inventoryCategoriesService: InventoryCategoriesService) {}

  @Get()
  findAll() {
    return this.inventoryCategoriesService.findAll();
  }

  @Post()
  create(@Body() dto: SaveInventoryCategoryDto) {
    return this.inventoryCategoriesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: SaveInventoryCategoryDto) {
    return this.inventoryCategoriesService.update(id, dto);
  }
}