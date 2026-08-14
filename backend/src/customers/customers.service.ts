import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
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

  async findAll(branchId?: string) {
    return this.prisma.customer.findMany({
      where: branchId ? { branchId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found.`);
    }
    return customer;
  }
}
