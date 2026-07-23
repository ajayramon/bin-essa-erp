import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(username: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            username: string;
            fullName: string;
            role: import("../../generated/prisma/enums").Role;
            branchId: string | null;
        };
    }>;
}
