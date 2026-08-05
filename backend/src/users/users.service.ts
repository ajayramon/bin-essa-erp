import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateRolePermissionDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../../generated/prisma/client';

const DEFAULT_ROLE_PERMISSIONS: Record<Role, string[]> = {
  ADMIN: ['dashboard', 'groupDashboard', 'pos', 'inventory', 'purchasing', 'accounting', 'hr', 'b2b', 'settings', 'promotions'],
  MANAGER: ['dashboard', 'pos', 'inventory', 'purchasing', 'accounting', 'customers', 'b2b', 'settings', 'promotions'],
  CASHIER: ['pos', 'sales-invoices'],
  ACCOUNTANT: ['inventory', 'purchasing', 'accounting', 'customers'],
  STOREKEEPER: ['inventory', 'purchasing'],
  SALES_REP: ['pos', 'sales-invoices', 'customers'],
  B2B_CUSTOMER: ['b2b'],
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        branchId: true,
        isActive: true,
        createdAt: true,
        branch: true,
        discountPermission: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        branchId: true,
        isActive: true,
        createdAt: true,
        branch: true,
        discountPermission: true,
      },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existing) {
      throw new ConflictException(`Username ${dto.username} is already taken`);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash,
        fullName: dto.fullName,
        role: dto.role,
        branchId: dto.branchId || null,
        isActive: dto.isActive ?? true,
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        branchId: true,
        isActive: true,
        createdAt: true,
        branch: true,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        fullName: dto.fullName,
        role: dto.role,
        branchId: dto.branchId,
        isActive: dto.isActive,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        branchId: true,
        isActive: true,
        createdAt: true,
        branch: true,
      },
    });
  }

  async getRolePermissions() {
    const records = await this.prisma.rolePermission.findMany();
    const map = new Map(records.map((r) => [r.role, r.modules]));

    const result: Array<{ role: Role; modules: string[] }> = [];
    for (const roleKey of Object.keys(DEFAULT_ROLE_PERMISSIONS) as Role[]) {
      const dbModules = map.get(roleKey);
      result.push({
        role: roleKey,
        modules: dbModules ?? DEFAULT_ROLE_PERMISSIONS[roleKey],
      });
    }
    return result;
  }

  async updateRolePermission(dto: UpdateRolePermissionDto) {
    return this.prisma.rolePermission.upsert({
      where: { role: dto.role },
      update: { modules: dto.modules },
      create: { role: dto.role, modules: dto.modules },
    });
  }
}
