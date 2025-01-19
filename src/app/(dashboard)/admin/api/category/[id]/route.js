import { NextResponse } from 'next/server';
import { getCategoryById, updateCategory } from '../../../libs/mockData';

export async function GET(request, { params }) {
  const { id } = params;
  console.log(`API GET request for category ID: ${id}`); // Debugging log

  const category = getCategoryById(parseInt(id, 10));

  if (category) {
    console.log('Category found:', category); // Debugging log
    return NextResponse.json({ category }, { status: 200 });
  } else {
    console.log('Category not found'); // Debugging log
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { newName: nameCategory } = await request.json();
  console.log(`API PUT request for category ID: ${id}, newName: ${nameCategory}`); // Debugging log

  const updatedCategory = updateCategory(parseInt(id, 10), { nameCategory });

  if (updatedCategory) {
    console.log('Category updated:', updatedCategory); // Debugging log
    return NextResponse.json({ message: "Category Updated", category: updatedCategory }, { status: 200 });
  } else {
    console.log('Category not found'); // Debugging log
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }
}