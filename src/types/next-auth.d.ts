import NextAuth from "next-auth";

type UserRole = string; // Or explicitly define valid roles

declare module "next-auth" {
    interface User {
        id: string; // Use string for Prisma's cuid
        email?: string;
        phone?: string;
        username?: string | null;
        role: UserRole; // Ensure consistency
    }

    interface Session {
        user: {
            id: string;
            email?: string;
            phone?: string;
            username?: string;
            role: UserRole;
        };
    }

    interface JWT {
        id: string;
        email?: string;
        phone?: string;
        username?: string;
        role: UserRole;
    }
}
