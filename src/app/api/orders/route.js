import { NextResponse } from 'next/server';
import { createOrder, getOrders, deleteOrderItem, getOrderStatus, updateOrderStatus } from '../../lib/orderedData';

export async function POST(request) {
  try {
    const newOrder = await request.json();
    const createdOrder = createOrder(newOrder);
    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const orderId = request.nextUrl.searchParams.get('orderId');
    if (userId) {
      const orders = getOrders(userId);
      const total = orders.reduce((acc, order) => acc + order.price * order.quantity, 0);
      return NextResponse.json({ items: orders, total }, { status: 200 });
    } else if (orderId) {
      const status = getOrderStatus(orderId);
      if (status === null) {
        throw new Error('Order not found');
      }
      return NextResponse.json({ status }, { status: 200 });
    } else {
      throw new Error('User ID or Order ID is required');
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { orderId, status } = await request.json();
    const updatedOrder = updateOrderStatus(orderId, status);
    if (!updatedOrder) {
      throw new Error('Order not found');
    }
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const itemId = request.nextUrl.searchParams.get('itemId');
    if (!userId || !itemId) {
      throw new Error('User ID and Item ID are required');
    }
    deleteOrderItem(userId, itemId);
    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting order item:', error);
    return NextResponse.json({ error: 'Failed to delete order item' }, { status: 500 });
  }
}