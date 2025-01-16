import { NextResponse } from 'next/server';
import { mockCategories } from '../../../lib/mockData/mockCategories';

export async function GET(request, { params }) {
  const { id } = params; // Extract the dynamic 'id' from the route
  if (!id) {
    return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
  }

  // Convert `id` to a number for comparison
  const numericId = parseInt(id, 10);

  // Search for the drink across all categories
  let drink = null;
  for (const category of mockCategories) {
    drink = category.content.find(item => item.id === numericId);
    if (drink) break;
  }

  if (!drink) {
    return NextResponse.json({ error: 'Drink not found' }, { status: 404 });
  }

  return NextResponse.json(drink);
}