export interface ApplicationUser {
    Id: string;
    AccessFailedCount: number;
    ConcurrencyStamp: string;
    Email: string;
    EmailConfirmed: boolean;
    LockoutEnabled: boolean;
    LockoutEnd: string;
    NormalizedEmail: string;
    NormalizedUserName: string;
    PasswordHash: string;
    PhoneNumber: string;
    PhoneNumberConfirmed: boolean;
    SecurityStamp: string;
    TwoFactorEnabled: boolean;
    UserName: string;
}
