import { NextResponse } from 'next/server';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../../libs/mockData';

export async function POST(request) {
  try {
    const { idCategory, nameCategory } = await request.json();
    const newCategory = { _id: Date.now().toString(), idCategory, nameCategory }; // Generate a unique ID for the new category
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
    const deletedCategory = deleteCategory(id);
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