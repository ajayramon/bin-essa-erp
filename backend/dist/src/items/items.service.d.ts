import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
export declare class ItemsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateItemDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        barcode: string | null;
        category: import("../../generated/prisma/enums").ItemCategory;
        visibility: import("../../generated/prisma/enums").ItemVisibility;
        price: import("@prisma/client-runtime-utils").Decimal;
        cost: import("@prisma/client-runtime-utils").Decimal;
        unit: string;
    }>;
}
