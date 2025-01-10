import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db"; // Assuming you have a Prisma client instance configured
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt", // Use JSON Web Tokens for session strategy
    },
    pages: {
        signIn: "/sign-in", // Redirect here if not authenticated
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Email or Phone", type: "text", placeholder: "jsmith@gmail.com or 012345678" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) {
                    return null;
                }

                const isEmail = /\S+@\S+\.\S+/.test(credentials.identifier);

                const existingUser = await db.user.findUnique({
                    where: isEmail
                        ? { email: credentials.identifier }
                        : { phone: credentials.identifier },
                });

                if (!existingUser) {
                    return null; // User not found
                }
if(existingUser.password){
    
}
                const passwordMatch = await compare(credentials.password, existingUser.password);

                if (!passwordMatch) {
                    return null; // Incorrect password
                }

                // Ensure the return object matches the `User` interface
                return {
                    id: existingUser.id,         // Number
                    username: existingUser.username || undefined, // Optional string
                    email: existingUser.email || undefined, // Optional string
                    phone: existingUser.phone || undefined, // Optional string
                    role: existingUser.role,     // String
                };
            },
        }),
    ],
    callbacks: {
        // Include user data in the JWT token
        async jwt({ token, user }) {
            if (user) {
                // Ensure all relevant fields are included in the token
                return {
                    ...token,
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                };
            }
            return token;
        },

        // Include user data in the session object
        async session({ session, token }) {
            // Explicitly type the token as JWT
            const typedToken = token as { id: number, username?: string, email?: string, phone?: string, role: string };

            session.user = {
                id: typedToken.id,
                username: typedToken.username,
                email: typedToken.email,
                phone: typedToken.phone,
                role: typedToken.role,
            };
            return session;
        },
    },
};
