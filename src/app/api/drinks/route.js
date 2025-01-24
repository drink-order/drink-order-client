import { NextResponse } from 'next/server';
import { getDrinks } from '../../(dashboard)/shop-owner/libs/mockDrinksData';

export async function GET() {
  try {
    const drinks = getDrinks();
    return NextResponse.json(drinks, { status: 200 });
  } catch (error) {
    console.error('Error fetching drinks:', error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}