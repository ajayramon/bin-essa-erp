import { Injectable } from '@nestjs/common';
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
}
