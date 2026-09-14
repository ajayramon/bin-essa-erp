import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class SaveInventorySubcategoryDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  nameEn!: string;

  @IsString()
  @IsNotEmpty()
  nameAr!: string;

  @IsBoolean()
  isActive!: boolean;
}

export class SaveInventoryCategoryDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  nameEn!: string;

  @IsString()
  @IsNotEmpty()
  nameAr!: string;

  @IsBoolean()
  isActive!: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveInventorySubcategoryDto)
  subcategories!: SaveInventorySubcategoryDto[];
}