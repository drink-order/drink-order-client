import { NextResponse } from 'next/server';
import { getDrinkById, updateDrink, deleteDrink } from '../../../libs/mockDrinksData';

export async function GET(request, { params }) {
  const { id } = params;
  const drink = getDrinkById(parseInt(id, 10));
  if (drink) {
    return NextResponse.json({ drink }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Drink not found" }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { categoryId, categoryName, image, title, soldCount, price, size, sugar, toppings } = await request.json();
  const updatedDrink = updateDrink(parseInt(id, 10), {
    categoryId,
    categoryName,
    image,
    title,
    soldCount,
    price,
    size,
    sugar,
    toppings,
    updatedAt: new Date().toISOString(), // Ensure updatedAt is updated
  });
  if (updatedDrink) {
    return NextResponse.json({ drink: updatedDrink }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Drink not found" }, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const deletedDrink = deleteDrink(parseInt(id, 10));
  if (deletedDrink) {
    return NextResponse.json({ drink: deletedDrink }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Drink not found" }, { status: 404 });
  }
}