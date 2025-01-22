import { NextResponse } from 'next/server';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../../libs/mockData';

export async function POST(request) {
  try {
    const { nameCategory } = await request.json();
    const newCategory = {
      nameCategory,
      createdAt: new Date(),
      updatedAt: new Date(),
    }; // Include createdAt and updatedAt
    const createdCategory = createCategory(newCategory);
    return NextResponse.json({ message: "Category Created", category: createdCategory }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const deletedCategory = deleteCategory(parseInt(id, 10));
    if (deletedCategory) {
      return NextResponse.json({ message: "Category Deleted" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}