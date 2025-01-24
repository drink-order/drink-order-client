import { NextResponse } from 'next/server';
import { getDrinkById } from '../../../(dashboard)/shop-owner/libs/mockDrinksData';

export async function GET(request, { params }) {
  const { id } = params; // Extract the dynamic 'id' from the route
  if (!id) {
    return NextResponse.json({ error: 'Invalid ID provided' }, { status: 400 });
  }

  // Convert `id` to a number for comparison
  const numericId = parseInt(id, 10);

  // Get the drink by ID
  const drink = getDrinkById(numericId);

  if (!drink) {
    return NextResponse.json({ error: 'Drink not found' }, { status: 404 });
  }

  return NextResponse.json(drink);
}