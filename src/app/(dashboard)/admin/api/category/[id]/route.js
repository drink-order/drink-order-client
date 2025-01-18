import { NextResponse } from 'next/server';
import { getCategoryById, updateCategory } from '../../../libs/mockData';

export async function PUT(request, { params }) {
  const { id } = params;
  const { newID: idCategory, newName: nameCategory } = await request.json();

  const updatedCategory = updateCategory(id, { idCategory, nameCategory });

  if (updatedCategory) {
    return NextResponse.json({ message: "Category Updated" }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }
}

export async function GET(request, { params }) {
  const { id } = params;

  const category = getCategoryById(id);

  if (category) {
    return NextResponse.json({ category }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }
}