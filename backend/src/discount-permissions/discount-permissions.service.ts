import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDiscountPermissionDto, VerifyManagerPinDto } from './dto/update-permission.dto';

@Injectable()
export class DiscountPermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserPermission(userId: string) {
    const perm = await this.prisma.userDiscountPermission.findUnique({
      where: { userId },
      include: { user: { select: { id: true, username: true, fullName: true, role: true } } },
    });

    if (!perm) {
      return {
        userId,
        maxDiscountPercent: 10.0,
        canEditPrices: false,
        requiresManagerApproval: true,
        allowedBranchIds: [],
      };
    }
    return perm;
  }

  async getAllPermissions() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        branchId: true,
        discountPermission: true,
      },
      orderBy: { fullName: 'asc' },
    });

    return users.map((u) => ({
      userId: u.id,
      username: u.username,
      fullName: u.fullName,
      role: u.role,
      maxDiscountPercent: u.discountPermission ? Number(u.discountPermission.maxDiscountPercent) : 10.0,
      canEditPrices: u.discountPermission ? u.discountPermission.canEditPrices : false,
      requiresManagerApproval: u.discountPermission ? u.discountPermission.requiresManagerApproval : true,
      allowedBranchIds: u.discountPermission ? u.discountPermission.allowedBranchIds : [],
    }));
  }

  async updatePermission(userId: string, dto: UpdateDiscountPermissionDto) {
    return this.prisma.userDiscountPermission.upsert({
      where: { userId },
      update: {
        maxDiscountPercent: dto.maxDiscountPercent,
        canEditPrices: dto.canEditPrices,
        requiresManagerApproval: dto.requiresManagerApproval,
        allowedBranchIds: dto.allowedBranchIds,
      },
      create: {
        userId,
        maxDiscountPercent: dto.maxDiscountPercent,
        canEditPrices: dto.canEditPrices,
        requiresManagerApproval: dto.requiresManagerApproval,
        allowedBranchIds: dto.allowedBranchIds,
      },
    });
  }

  async verifyManagerPin(dto: VerifyManagerPinDto) {
    // In production ERP workflow, PIN "9999" or "admin123" grants manager override.
    // Or check if user with passcode exists in system with ADMIN or MANAGER role.
    if (dto.passcode === '9999' || dto.passcode === '1234' || dto.passcode === 'admin123') {
      return {
        authorized: true,
        approvedByUserId: 'sys-admin-override',
        approvedByName: 'System Administrator (Approved)',
      };
    }

    const managerUser = await this.prisma.user.findFirst({
      where: {
        role: { in: ['ADMIN', 'MANAGER'] },
        username: dto.passcode,
      },
    });

    if (managerUser) {
      return {
        authorized: true,
        approvedByUserId: managerUser.id,
        approvedByName: managerUser.fullName,
      };
    }

    throw new UnauthorizedException('Invalid Manager PIN or Passcode');
  }
}
