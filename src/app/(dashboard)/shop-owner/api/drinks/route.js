import { NextResponse } from 'next/server';
import { getDrinks, createDrink } from '../../libs/mockDrinksData';

export async function GET() {
  try {
    const drinks = getDrinks();
    return NextResponse.json({ drinks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching drinks:", error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { categoryId, categoryName, image, title, soldCount, price, size, sugar, toppings } = await request.json();
    const currentDate = new Date().toISOString();
    const newDrink = createDrink({
      categoryId,
      categoryName,
      image,
      title,
      soldCount,
      price,
      size,
      sugar,
      toppings,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    return NextResponse.json({ drink: newDrink }, { status: 201 });
  } catch (error) {
    console.error("Error creating drink:", error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}