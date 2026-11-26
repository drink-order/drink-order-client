import { NextResponse } from 'next/server';
import haversine from '../../utils/haversine';

export async function POST(req) {
    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ message: 'Invalid JSON body.' }, { status: 400 });
    }

    const { latitude, longitude } = body ?? {};

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return NextResponse.json({ message: 'Latitude and longitude must be numbers.' }, { status: 400 });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return NextResponse.json({ message: 'Latitude or longitude is out of range.' }, { status: 400 });
    }

    const shopLatitude = 11.507937025778226; // Example shop latitude
    const shopLongitude = 104.88473885684941; // Example shop longitude
    const allowedRadius = 3; // km
  
    const distance = haversine(shopLatitude, shopLongitude, latitude, longitude);

    if (distance <= allowedRadius) {
        return NextResponse.json({ status: 'success', message: 'Welcome! You can place an order.' }, { status: 200 });
    } else {
        return NextResponse.json({ status: 'error', message: 'You are too far from the shop to place an order.' }, { status: 200 });
    }
}