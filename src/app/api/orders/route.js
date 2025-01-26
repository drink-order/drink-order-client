import { NextResponse } from 'next/server';
import {
  createOrder,
  getOrders,
  getOrderStatus,
  deleteOrder,
  deleteAllOrders,
  updateOrder
} from '../../lib/orderedData';

export async function GET(request) {
  try {
    const orderId = request.nextUrl.searchParams.get('orderId');
    const userId = request.nextUrl.searchParams.get('userId');

    if (orderId) {
      const status = getOrderStatus(orderId);
      if (status === null) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ status }, { status: 200 });
    }

    if (userId) {
      const orders = getOrders(userId);
      if (orders.length === 0) {
        return NextResponse.json({ message: 'No orders found', orders: [] }, { status: 200 });
      }
      return NextResponse.json({ orders }, { status: 200 });
    }

    return NextResponse.json({ message: 'Order ID or User ID is required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, items, status, date } = await request.json();
    if (!userId || !items || !status || !date) {
      return NextResponse.json({ error: 'User ID, items, status, and date are required' }, { status: 400 });
    }
    const newOrder = createOrder(userId, { items, status, date });
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { userId, orderId } = await request.json();

    if (userId && orderId) {
      const success = deleteOrder(userId, orderId);
      if (!success) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
    } else if (userId) {
      deleteAllOrders(userId);
      return NextResponse.json({ message: 'All orders deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting order(s):', error);
    return NextResponse.json({ error: 'Failed to delete order(s)' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { userId, orderId, updateData } = await request.json();
    if (!userId || !orderId || !updateData) {
      return NextResponse.json({ error: 'User ID, order ID, and update data are required' }, { status: 400 });
    }
    const updatedOrder = updateOrder(userId, orderId, updateData);
    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}