import { db } from "../../lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";

// Regular expression for validating Cambodian phone numbers
const phoneRegex = /^0\d{8,9}$/;

// Define the schema for input validation
const userSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    identifier: z
      .string()
      .min(1, "Email or phone number is required")
      .refine(
        (value) => value.includes("@") || phoneRegex.test(value),
        "Must be a valid email or phone number"
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
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, username, password, role } = userSchema.parse(body);

    // Determine whether the identifier is an email or a phone number
    const isEmail = identifier.includes("@");

    const existingUser = await db.user.findFirst({
      where: isEmail
        ? { email: identifier }
        : { phone: identifier }, // Assuming a `phone` field exists in your database
    });

    // Check if the email or phone already exists
    if (existingUser) {
      return NextResponse.json(
        { user: null, message: "User with this identifier already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    // Create the new user
    const newUser = await db.user.create({
      data: {
        email: isEmail ? identifier : null,
        phone: !isEmail ? identifier : null,
        username,
        password: hashedPassword,
        role, // Add the role field here
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { user: rest, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
  
}

// New handler to get all users
export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
