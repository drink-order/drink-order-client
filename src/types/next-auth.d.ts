import NextAuth from "next-auth";
import { JWT } from "next-auth";

// Define UserRole type for roles
type UserRole = 'admin' | 'shopOwner' | 'staff' | 'user';

declare module "next-auth" {
    interface User {
        id: number; // Prisma's `id` is an Int, so use `number` here
        email?: string; // Email is optional
        phone?: string; // Phone is optional
        username?: string;null // Username is optional
        role: string; // Role has a default value, so it's required
    }

    interface Session {
        user: {
            id: number;
            email?: string;
            phone?: string;
            username?: string;
            role: string;
        };
    }

    interface JWT {
        id: number;
        email?: string;
        phone?: string;
        username?: string;
        role: string;
    }
}
