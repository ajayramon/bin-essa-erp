import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
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
