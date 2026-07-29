import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.supplier.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateSupplierDto) {
    return this.prisma.supplier.create({
      data: {
        code: dto.code,
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        branchId: dto.branchId,
      },
    });
  }
}
