import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db"; // Prisma client instance
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";

type UserRole = "admin" | "shopOwner" | "staff" | "user";

interface CustomSession extends Session {
    user: {
        id: string;
        username?: string;
        name?: string;
        email?: string;
        phone?: string;
        role: UserRole;
    };
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET || "default_secret", // Fallback for development
    session: {
        strategy: "jwt", // Use JSON Web Tokens for session strategy
    },
    pages: {
        signIn: "/sign-in", // Redirect here if not authenticated
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid profile email",
                },
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Phone", type: "text", placeholder: "jsmith@gmail.com or 012345678" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.identifier || !credentials?.password) {
                        throw new Error("Missing identifier or password");
                    }

                    const isEmail = /\S+@\S+\.\S+/.test(credentials.identifier);

                    const existingUser = await db.user.findUnique({
                        where: isEmail
                            ? { email: credentials.identifier }
                            : { phone: credentials.identifier },
                    });

                    if (!existingUser) {
                        throw new Error("User not found");
                    }

                    if (existingUser.password) {
                        const passwordMatch = await compare(credentials.password, existingUser.password);
                        if (!passwordMatch) {
                            throw new Error("Invalid password");
                        }
                    }

                    const validRoles: UserRole[] = ["admin", "shopOwner", "staff", "user"];
                    const role: UserRole = validRoles.includes(existingUser.role as UserRole)
                        ? (existingUser.role as UserRole)
                        : "user"; // Default to 'user'

                    return {
                        id: existingUser.id,
                        username: existingUser.username || undefined,
                        name: existingUser.name || undefined,
                        email: existingUser.email || undefined,
                        phone: existingUser.phone || undefined,
                        role,
                    };
                } catch (error) {
                    console.error("Authorization error:", error.message);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                };
            }
            return token;
        },

        async session({ session, token }) {
            const typedToken = token as {
                id: string;
                username?: string;
                name?: string;
                email?: string;
                phone?: string;
                role: UserRole;
            };

            const customSession: CustomSession = {
                ...session,
                user: {
                    id: typedToken.id,
                    username: typedToken.username,
                    name: typedToken.name,
                    email: typedToken.email,
                    phone: typedToken.phone,
                    role: typedToken.role,
                },
            };

            return customSession;
        },
    },
};