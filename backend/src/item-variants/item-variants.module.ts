import { Module } from '@nestjs/common';
import { ItemVariantsService } from './item-variants.service';
import { ItemVariantsController } from './item-variants.controller';

@Module({
  controllers: [ItemVariantsController],
  providers: [ItemVariantsService],
  exports: [ItemVariantsService],
})
export class ItemVariantsModule {}
