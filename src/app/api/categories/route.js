import { NextResponse } from 'next/server';
import { getCategories } from '../../(dashboard)/shop-owner/libs/mockCategoryData';

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}