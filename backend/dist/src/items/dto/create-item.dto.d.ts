import { ItemCategory, ItemVisibility } from '../../../generated/prisma/client';
export declare class CreateItemDto {
    sku: string;
    barcode?: string;
    name: string;
    category: ItemCategory;
    visibility?: ItemVisibility;
    price: number;
    cost: number;
    unit?: string;
    isActive?: boolean;
}
