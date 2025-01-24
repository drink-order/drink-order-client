import { NextResponse } from 'next/server';
import { createOrder, getOrders, updateOrder, deleteOrder } from '../../lib/orderService';

export async function POST(request) {
  try {
    const { userId, orderData } = await request.json();
    const newOrder = await createOrder(userId, orderData);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      throw new Error('User ID is required');
    }
    const orders = await getOrders(userId);
    const total = orders.reduce((acc, order) => acc + order.price * order.quantity, 0);
    return NextResponse.json({ items: orders, total }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const itemId = request.nextUrl.searchParams.get('itemId');
    if (!userId || !itemId) {
      throw new Error('User ID and Item ID are required');
    }
    await deleteOrder(userId, itemId);
    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}