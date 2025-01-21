import { NextResponse } from 'next/server';
import { getCategories, getCategoryById } from '../../libs/mockCategoryData';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('id');

  try {
    if (categoryId) {
      const category = getCategoryById(parseInt(categoryId, 10));
      if (category) {
        return NextResponse.json({ category });
      } else {
        return NextResponse.json({ message: "Category not found" }, { status: 404 });
      }
    } else {
      const categories = getCategories();
      return NextResponse.json({ categories });
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}