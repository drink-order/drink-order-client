import { NextResponse } from 'next/server';
import { db } from '../../lib/db';
import { hash } from 'bcrypt';
import * as z from 'zod';

// Regular expression for validating phone numbers that start with 0
const phoneRegex = /^0\d{8,9}$/;

// Define the schema for input validation
const userSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().email("Invalid email address").nullable().optional(),
    phone: z.string().nullable().optional().refine(
      (value) => !value || phoneRegex.test(value),
      "Must be a valid phone number"
    ),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have at least 8 characters"),
    role: z
      .string()
      .optional()
      .default("user")  // Set default role as 'user' if not provided
      .refine((val) => ["admin", "shop owner", "staff", "user"].includes(val), {
        message: "Invalid role",
      }),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email", "phone"],
  });

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, phone, username, password, role } = userSchema.parse(body);

    console.log("Received request to create user with email:", email, "and phone:", phone);

    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          phone ? { phone } : undefined
        ].filter(Boolean)
      }
    });

    console.log("Database query result for existing user:", existingUser);

    // Check if the email or phone already exists
    if (existingUser) {
      console.log("User already exists with email:", email, "or phone:", phone);
      return NextResponse.json(
        { user: null, message: "User with this email or phone already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    // Create the new user
    const newUser = await db.user.create({
      data: {
        email,
        phone: phone || null, // Ensure phone is null if not provided
        username,
        password: hashedPassword,
        role, // Add the role field here
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    console.log("User created successfully with email:", email, "and phone:", phone);

    return NextResponse.json(
      { user: rest, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { id, username, email, phone, role } = await req.json();

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        username,
        email,
        phone,
        role,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { user: updatedUser, message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    const deletedUser = await db.user.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}