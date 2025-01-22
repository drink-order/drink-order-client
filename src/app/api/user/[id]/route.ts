import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import * as z from 'zod';

// Define the schema for input validation
const userUpdateSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  role: z
    .string()
    .optional()
    .refine((val) => ["admin", "shop owner", "staff", "user"].includes(val), {
      message: "Invalid role",
    }),
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const user = await db.user.findUnique({
      where: { id },
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

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { username, email, phone, role } = userUpdateSchema.parse(body);

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
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const deletedUser = await db.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}