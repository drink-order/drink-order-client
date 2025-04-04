import { NextResponse } from 'next/server';
import { getCart, addToCart, removeFromCart, clearCart } from '../../lib/orderService';

export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      throw new Error('User ID is required');
    }
    const cart = getCart(userId);
    return NextResponse.json({ items: cart }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, orderData } = await request.json();
    if (!userId || !orderData) {
      throw new Error('User ID and order data are required');
    }
    const newItem = addToCart(userId, orderData);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const itemId = request.nextUrl.searchParams.get('itemId');

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (itemId) {
      const success = removeFromCart(userId, itemId);
      if (!success) {
        throw new Error('Failed to delete item from cart');
      }
      return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } else {
      const success = clearCart(userId);
      if (!success) {
        throw new Error('Failed to clear cart');
      }
      return NextResponse.json({ message: 'Cart cleared successfully' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    return NextResponse.json({ error: 'Failed to delete item from cart' }, { status: 500 });
  }
}